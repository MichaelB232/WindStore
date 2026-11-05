import os
import time
from typing import Any, Dict, List, Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

import config
from agent import WindStoreAgent

app = FastAPI(
    title="WindStore AI Agent API",
    description="REST API for WindStore autonomous AI assistant with tool calling.",
    version="1.0.0",
)

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows Next.js frontend or proxy
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory session store: session_id -> {"agent": WindStoreAgent, "last_active": timestamp}
_sessions: Dict[str, Dict[str, Any]] = {}
MAX_SESSIONS = 500
SESSION_TTL_SECONDS = 3600 * 6  # 6 hours


def _clean_old_sessions():
    now = time.time()
    expired = [
        sid
        for sid, data in _sessions.items()
        if now - data.get("last_active", now) > SESSION_TTL_SECONDS
    ]
    for sid in expired:
        _sessions.pop(sid, None)
    if len(_sessions) > MAX_SESSIONS:
        # Sort by oldest active and evict oldest 50
        sorted_sids = sorted(_sessions.keys(), key=lambda s: _sessions[s]["last_active"])
        for sid in sorted_sids[:50]:
            _sessions.pop(sid, None)


def get_agent_for_session(session_id: str) -> WindStoreAgent:
    """Retrieve existing agent or initialize a new one for session_id."""
    _clean_old_sessions()
    now = time.time()
    if session_id not in _sessions:
        _sessions[session_id] = {
            "agent": WindStoreAgent(verbose=True),
            "last_active": now,
        }
    else:
        _sessions[session_id]["last_active"] = now
    return _sessions[session_id]["agent"]


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, description="Pesan / pertanyaan dari user.")
    session_id: Optional[str] = Field("default", description="ID sesi percakapan.")
    reset: Optional[bool] = Field(False, description="Mulai percakapan baru jika True.")


class ToolRecord(BaseModel):
    name: str
    args: Dict[str, Any]
    success: bool


class ChatResponse(BaseModel):
    success: bool
    reply: str
    tools_used: List[ToolRecord]
    session_id: str


class ResetRequest(BaseModel):
    session_id: Optional[str] = "default"


# --- Endpoints ---

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "windstore-ai-agent",
        "model": config.GEMINI_MODEL,
        "api_base_url": config.API_BASE_URL,
        "active_sessions": len(_sessions),
    }


@app.post("/api/chat", response_model=ChatResponse)
def chat_endpoint(req: ChatRequest):
    session_id = req.session_id or "default"
    agent = get_agent_for_session(session_id)

    if req.reset:
        agent.reset()

    # Track tools executed during this question
    tools_called: List[ToolRecord] = []

    def on_tool(name: str, args: dict, result: dict):
        tools_called.append(
            ToolRecord(
                name=name,
                args=args,
                success=bool(result.get("success", True)),
            )
        )

    agent.on_tool_call = on_tool

    try:
        reply = agent.ask(req.message)
        return ChatResponse(
            success=True,
            reply=reply,
            tools_used=tools_called,
            session_id=session_id,
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Terjadi kesalahan saat memproses permintaan: {str(e)}",
        )


@app.post("/api/chat/reset")
def reset_endpoint(req: ResetRequest):
    session_id = req.session_id or "default"
    if session_id in _sessions:
        _sessions[session_id]["agent"].reset()
    return {"success": True, "message": f"Sesi {session_id} berhasil di-reset."}


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT") or os.getenv("AGENT_PORT") or 8001)
    is_prod = os.getenv("NODE_ENV") == "production" or os.getenv("ENV") == "production"
    print(f"Starting WindStore Agent API on port {port}...")
    uvicorn.run("api_server:app", host="0.0.0.0", port=port, reload=not is_prod)
