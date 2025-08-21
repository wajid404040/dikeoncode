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

    const { toUserId, content } = await request.json();

    if (!toUserId || !content) {
      return NextResponse.json({ message: "Recipient user ID and message content are required" }, { status: 400 });
    }

    // Check if they are friends
    const friendship = await prisma.friendRequest.findFirst({
      where: {
        OR: [
          { fromUserId: decoded.userId, toUserId, status: "ACCEPTED" },
          { fromUserId: toUserId, toUserId: decoded.userId, status: "ACCEPTED" },
        ],
      },
    });

    if (!friendship) {
      return NextResponse.json({ message: "You can only send messages to your friends" }, { status: 403 });
    }

    // Create message
    const message = await prisma.message.create({
      data: {
        fromUserId: decoded.userId,
        toUserId,
        content,
      },
      include: {
        fromUser: {
          select: {
            id: true,
            name: true,
            surname: true,
            selectedAvatar: true,
          },
        },
        toUser: {
          select: {
            id: true,
            name: true,
            surname: true,
            selectedAvatar: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        message: "Message sent successfully",
        data: message,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Send message error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
