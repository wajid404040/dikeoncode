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

    const { requestId, action } = await request.json();

    if (!requestId || !action) {
      return NextResponse.json({ message: "Request ID and action are required" }, { status: 400 });
    }

    if (!["ACCEPTED", "REJECTED"].includes(action)) {
      return NextResponse.json({ message: "Invalid action. Must be 'ACCEPTED' or 'REJECTED'" }, { status: 400 });
    }

    // Find the friend request
    const friendRequest = await prisma.friendRequest.findUnique({
      where: { id: requestId },
    });

    if (!friendRequest) {
      return NextResponse.json({ message: "Friend request not found" }, { status: 404 });
    }

    // Check if user is the recipient of the request
    if (friendRequest.toUserId !== decoded.userId) {
      return NextResponse.json({ message: "You can only respond to requests sent to you" }, { status: 403 });
    }

    // Update friend request status
    const updatedRequest = await prisma.friendRequest.update({
      where: { id: requestId },
      data: { status: action },
    });

    return NextResponse.json({
      message: `Friend request ${action.toLowerCase()} successfully`,
      request: updatedRequest,
    });
  } catch (error) {
    console.error("Respond to friend request error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
