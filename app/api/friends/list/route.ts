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

    // Get all friend requests for this user
    const friendRequests = await prisma.friendRequest.findMany({
      where: {
        OR: [{ fromUserId: decoded.userId }, { toUserId: decoded.userId }],
      },
      include: {
        fromUser: {
          select: {
            id: true,
            name: true,
            surname: true,
            email: true,
            selectedAvatar: true,
            lastSeen: true,
          },
        },
        toUser: {
          select: {
            id: true,
            name: true,
            surname: true,
            email: true,
            selectedAvatar: true,
            lastSeen: true,
          },
        },
      },
    });

    // Separate into different lists
    const friends: any[] = [];
    const sentRequests: any[] = [];
    const receivedRequests: any[] = [];

    friendRequests.forEach((request) => {
      const isFromUser = request.fromUserId === decoded.userId;
      const otherUser = isFromUser ? request.toUser : request.fromUser;

      if (request.status === "ACCEPTED") {
        friends.push({
          id: otherUser.id,
          name: otherUser.name,
          surname: otherUser.surname,
          email: otherUser.email,
          selectedAvatar: otherUser.selectedAvatar,
          fullName: `${otherUser.name} ${otherUser.surname}`,
          isOnline: otherUser.lastSeen ? Date.now() - new Date(otherUser.lastSeen).getTime() < 300000 : false, // 5 minutes
          lastSeen: otherUser.lastSeen,
        });
      } else if (request.status === "PENDING") {
        if (isFromUser) {
          sentRequests.push({
            id: request.id,
            user: {
              id: otherUser.id,
              name: otherUser.name,
              surname: otherUser.surname,
              email: otherUser.email,
              selectedAvatar: otherUser.selectedAvatar,
              fullName: `${otherUser.name} ${otherUser.surname}`,
            },
            type: "sent",
          });
        } else {
          receivedRequests.push({
            id: request.id,
            user: {
              id: otherUser.id,
              name: otherUser.name,
              surname: otherUser.surname,
              email: otherUser.email,
              selectedAvatar: otherUser.selectedAvatar,
              fullName: `${otherUser.name} ${otherUser.surname}`,
            },
            type: "received",
          });
        }
      }
    });

    return NextResponse.json({
      message: "Friends list retrieved successfully",
      friends,
      sentRequests,
      receivedRequests,
    });
  } catch (error) {
    console.error("Get friends error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
