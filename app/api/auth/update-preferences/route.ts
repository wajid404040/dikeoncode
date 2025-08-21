import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "No token provided" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

    if (!decoded || !decoded.userId) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    const { selectedAvatar, selectedVoice } = await request.json();

    if (!selectedAvatar || !selectedVoice) {
      return NextResponse.json({ message: "Avatar and voice selection are required" }, { status: 400 });
    }

    // Update user preferences
    const updatedUser = await prisma.user.update({
      where: { id: decoded.userId },
      data: {
        selectedAvatar,
        selectedVoice,
      },
      select: {
        id: true,
        name: true,
        surname: true,
        email: true,
        selectedAvatar: true,
        selectedVoice: true,
        status: true,
      },
    });

    return NextResponse.json({
      message: "Preferences updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update preferences error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
