import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);
    const friendId = searchParams.get("friendId");

    if (!friendId) {
      return NextResponse.json({ message: "Friend ID parameter is required" }, { status: 400 });
    }

    // Check if they are friends
    const friendship = await prisma.friendRequest.findFirst({
      where: {
        OR: [
          { fromUserId: decoded.userId, toUserId: friendId, status: "ACCEPTED" },
          { fromUserId: friendId, toUserId: decoded.userId, status: "ACCEPTED" },
        ],
      },
    });

    if (!friendship) {
      return NextResponse.json({ message: "You can only view messages with your friends" }, { status: 403 });
    }

    // Get messages between the two users
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { fromUserId: decoded.userId, toUserId: friendId },
          { fromUserId: friendId, toUserId: decoded.userId },
        ],
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
      orderBy: { createdAt: "asc" },
    });

    // Mark messages as read if they were sent to the current user
    await prisma.message.updateMany({
      where: {
        fromUserId: friendId,
        toUserId: decoded.userId,
        isRead: false,
      },
      data: { isRead: true },
    });

    return NextResponse.json({
      message: "Messages retrieved successfully",
      messages: messages.map((msg) => ({
        ...msg,
        fromUser: {
          ...msg.fromUser,
          fullName: `${msg.fromUser.name} ${msg.fromUser.surname}`,
        },
        toUser: {
          ...msg.toUser,
          fullName: `${msg.toUser.name} ${msg.toUser.surname}`,
        },
      })),
    });
  } catch (error) {
    console.error("Get messages error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
