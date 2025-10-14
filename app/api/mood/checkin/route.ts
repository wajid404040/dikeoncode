import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    
    if (!token) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    const { mood, notes } = await request.json();

    if (!mood) {
      return NextResponse.json({ error: "Mood is required" }, { status: 400 });
    }

    // Check if user already checked in today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const existingMood = await prisma.moodEntry.findFirst({
      where: {
        userId: decoded.userId,
        timestamp: {
          gte: today,
          lt: tomorrow,
        },
      },
    });

    let moodEntry;
    if (existingMood) {
      // Update existing mood entry
      moodEntry = await prisma.moodEntry.update({
        where: { id: existingMood.id },
        data: {
          mood,
          notes: notes || null,
          timestamp: new Date(),
        },
      });
    } else {
      // Create new mood entry
      moodEntry = await prisma.moodEntry.create({
        data: {
          userId: decoded.userId,
          mood,
          notes: notes || null,
          timestamp: new Date(),
        },
      });
    }

    return NextResponse.json({
      success: true,
      moodEntry: {
        id: moodEntry.id,
        mood: moodEntry.mood,
        notes: moodEntry.notes,
        timestamp: moodEntry.timestamp,
      },
    });
  } catch (error) {
    console.error("Error creating mood entry:", error);
    return NextResponse.json(
      { error: "Failed to create mood entry" },
      { status: 500 }
    );
  }
}
