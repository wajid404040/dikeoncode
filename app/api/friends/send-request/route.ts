import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
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

    const { toUserId } = await request.json();

    if (!toUserId) {
      return NextResponse.json({ message: "Recipient user ID is required" }, { status: 400 });
    }

    // Check if trying to send request to self
    if (decoded.userId === toUserId) {
      return NextResponse.json({ message: "Cannot send friend request to yourself" }, { status: 400 });
    }

    // Check if recipient user exists and is approved
    const recipientUser = await prisma.user.findUnique({
      where: { id: toUserId },
      select: { id: true, status: true },
    });

    if (!recipientUser) {
      return NextResponse.json({ message: "Recipient user not found" }, { status: 404 });
    }

    if (recipientUser.status !== "APPROVED") {
      return NextResponse.json({ message: "Cannot send friend request to unapproved user" }, { status: 400 });
    }

    // Check if friend request already exists
    const existingRequest = await prisma.friendRequest.findFirst({
      where: {
        OR: [
          { fromUserId: decoded.userId, toUserId },
          { fromUserId: toUserId, toUserId: decoded.userId },
        ],
      },
    });

    if (existingRequest) {
      return NextResponse.json({ message: "Friend request already exists" }, { status: 409 });
    }

    // Create friend request
    const friendRequest = await prisma.friendRequest.create({
      data: {
        fromUserId: decoded.userId,
        toUserId,
        status: "PENDING",
      },
    });

    return NextResponse.json(
      {
        message: "Friend request sent successfully",
        request: friendRequest,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Send friend request error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
