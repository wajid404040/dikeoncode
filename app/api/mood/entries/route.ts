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

    // Get all mood entries for the user, ordered by most recent first
    const moodEntries = await prisma.moodEntry.findMany({
      where: {
        userId: decoded.userId,
      },
      orderBy: {
        timestamp: 'desc',
      },
    });

    return NextResponse.json({
      entries: moodEntries.map(entry => ({
        id: entry.id,
        mood: entry.mood,
        notes: entry.notes,
        timestamp: entry.timestamp.toISOString(),
      })),
    });
  } catch (error) {
    console.error("Error fetching mood entries:", error);
    return NextResponse.json(
      { error: "Failed to fetch mood entries" },
      { status: 500 }
    );
  }
}
