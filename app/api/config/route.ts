import { NextResponse } from "next/server";

export async function GET() {
  console.log("🔑 Config route called");

  const apiKey = process.env.HUME_API_KEY;
  console.log("🔑 API key exists:", !!apiKey);
  console.log("🔑 API key length:", apiKey ? apiKey.length : 0);

  if (!apiKey) {
    console.error("❌ No HUME_API_KEY found in environment");
    return NextResponse.json(
      {
        message: "API key not configured",
        error: "HUME_API_KEY environment variable is missing",
      },
      { status: 500 }
    );
  }

  if (apiKey.length < 10) {
    console.error("❌ API key seems too short:", apiKey.length);
    return NextResponse.json(
      {
        message: "Invalid API key",
        error: "API key appears to be invalid",
      },
      { status: 500 }
    );
  }

  console.log("✅ Returning API key");
  return NextResponse.json({
    apiKey,
    message: "API key retrieved successfully",
    timestamp: new Date().toISOString(),
  });
}
