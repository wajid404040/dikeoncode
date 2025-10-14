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

    // Get user's feedback
    const feedback = await prisma.feedback.findMany({
      where: {
        userId: decoded.userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Calculate stats
    const total = feedback.length;
    const pending = feedback.filter(f => f.status === "pending").length;
    const inProgress = feedback.filter(f => f.status === "in_progress").length;
    const resolved = feedback.filter(f => f.status === "resolved").length;
    
    const ratings = feedback.filter(f => f.rating !== null).map(f => f.rating!);
    const averageRating = ratings.length > 0 
      ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length 
      : 0;

    const stats = {
      total,
      pending,
      inProgress,
      resolved,
      averageRating: Math.round(averageRating * 10) / 10,
    };

    return NextResponse.json({
      feedback: feedback.map(item => ({
        id: item.id,
        title: item.title,
        description: item.description,
        category: item.category,
        priority: item.priority,
        status: item.status,
        rating: item.rating,
        createdAt: item.createdAt.toISOString(),
        updatedAt: item.updatedAt.toISOString(),
        adminResponse: item.adminResponse,
        adminResponseDate: item.adminResponseDate?.toISOString(),
      })),
      stats,
    });
  } catch (error) {
    console.error("Error fetching feedback:", error);
    return NextResponse.json(
      { error: "Failed to fetch feedback" },
      { status: 500 }
    );
  }
}
