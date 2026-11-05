import { NextRequest, NextResponse } from "next/server";

const AGENT_API_URL = process.env.AGENT_API_URL || "http://localhost:8001";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sessionId = "default" } = body;

    const agentRes = await fetch(`${AGENT_API_URL}/api/chat/reset`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        session_id: sessionId,
      }),
    });

    if (!agentRes.ok) {
      return NextResponse.json(
        { success: false, message: "Gagal me-reset sesi di agent." },
        { status: agentRes.status }
      );
    }

    const data = await agentRes.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Tidak dapat terhubung ke server agent." },
      { status: 503 }
    );
  }
}
