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

    const { emotion, intensity } = await request.json();

    if (!emotion || !intensity) {
      return NextResponse.json({ message: "Emotion and intensity are required" }, { status: 400 });
    }

    // Get all accepted friends
    const friendships = await prisma.friendRequest.findMany({
      where: {
        OR: [
          { fromUserId: decoded.userId, status: "ACCEPTED" },
          { toUserId: decoded.userId, status: "ACCEPTED" },
        ],
      },
      include: {
        fromUser: {
          select: { id: true, name: true, surname: true },
        },
        toUser: {
          select: { id: true, name: true, surname: true },
        },
      },
    });

    if (friendships.length === 0) {
      return NextResponse.json({
        message: "No friends to send alert to",
        alertsSent: 0,
      });
    }

    // Create emotion alerts for each friend
    const alertPromises = friendships.map(async (friendship) => {
      const friendId = friendship.fromUserId === decoded.userId ? friendship.toUserId : friendship.fromUserId;

      const friendName =
        friendship.fromUserId === decoded.userId
          ? `${friendship.toUser.name} ${friendship.toUser.surname}`
          : `${friendship.fromUser.name} ${friendship.fromUser.surname}`;

      return prisma.emotionAlert.create({
        data: {
          fromUserId: decoded.userId,
          toUserId: friendId,
          emotion,
          intensity,
          message: `Your friend is experiencing ${emotion} with ${intensity} intensity. They might need your support.`,
        },
      });
    });

    const alerts = await Promise.all(alertPromises);

    return NextResponse.json(
      {
        message: "Emotion alerts sent successfully",
        alertsSent: alerts.length,
        alerts,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Send emotion alert error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
