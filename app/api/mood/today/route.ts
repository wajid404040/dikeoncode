import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    
    if (!token) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };

    // Get today's mood entry
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const moodEntry = await prisma.moodEntry.findFirst({
      where: {
        userId: decoded.userId,
        timestamp: {
          gte: today,
          lt: tomorrow,
        },
      },
      orderBy: {
        timestamp: 'desc',
      },
    });

    return NextResponse.json({
      mood: moodEntry?.mood || null,
      notes: moodEntry?.notes || null,
      timestamp: moodEntry?.timestamp || null,
      hasCheckedIn: !!moodEntry,
    });
  } catch (error) {
    console.error("Error fetching today's mood:", error);
    return NextResponse.json(
      { error: "Failed to fetch today's mood" },
      { status: 500 }
    );
  }
}
