import { NextRequest, NextResponse } from "next/server";

const AGENT_API_URL = process.env.AGENT_API_URL || "http://localhost:8001";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, sessionId = "default", reset = false } = body;

    if (!message && !reset) {
      return NextResponse.json(
        { success: false, reply: "Pesan tidak boleh kosong." },
        { status: 400 }
      );
    }

    const agentRes = await fetch(`${AGENT_API_URL}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: message || "Halo",
        session_id: sessionId,
        reset,
      }),
      // Timeout after 30 seconds for complex agent tool calling loops
      signal: AbortSignal.timeout(35000),
    });

    if (!agentRes.ok) {
      const errText = await agentRes.text();
      return NextResponse.json(
        {
          success: false,
          reply: `Maaf, terjadi gangguan pada server agent AI`,
        },
        { status: agentRes.status }
      );
    }

    const data = await agentRes.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Agent chat proxy error:", error);
    if (error.name === "TimeoutError") {
      return NextResponse.json(
        {
          success: false,
          reply: "Permintaan memakan waktu terlalu lama. Silakan coba pertanyaan yang lebih spesifik.",
        },
        { status: 504 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        reply:
          "AI Assistant saat ini sedang offline. Pastikan service agent Python sudah dijalankan (python api_server.py di port 8001).",
      },
      { status: 503 }
    );
  }
}
