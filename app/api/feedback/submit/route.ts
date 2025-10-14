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
    const { title, description, category, priority, rating } = await request.json();

    if (!title || !description) {
      return NextResponse.json({ error: "Title and description are required" }, { status: 400 });
    }

    const feedback = await prisma.feedback.create({
      data: {
        userId: decoded.userId,
        title: title.trim(),
        description: description.trim(),
        category: category || "general",
        priority: priority || "medium",
        rating: rating || null,
        status: "pending",
      },
    });

    return NextResponse.json({
      success: true,
      feedback: {
        id: feedback.id,
        title: feedback.title,
        description: feedback.description,
        category: feedback.category,
        priority: feedback.priority,
        rating: feedback.rating,
        status: feedback.status,
        createdAt: feedback.createdAt,
      },
    });
  } catch (error) {
    console.error("Error creating feedback:", error);
    return NextResponse.json(
      { error: "Failed to create feedback" },
      { status: 500 }
    );
  }
}
