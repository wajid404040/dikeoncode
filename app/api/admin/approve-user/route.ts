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

    // Check if user is the specific admin
    const adminUser = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { status: true, email: true },
    });

    if (!adminUser || adminUser.status !== "APPROVED" || adminUser.email !== "admin@dia.com") {
      return NextResponse.json({ message: "Access denied. Admin privileges required." }, { status: 403 });
    }

    const { userId, action } = await request.json();

    if (!userId || !action) {
      return NextResponse.json({ message: "User ID and action are required" }, { status: 400 });
    }

    if (!["APPROVED", "REJECTED"].includes(action)) {
      return NextResponse.json({ message: "Invalid action. Must be 'APPROVED' or 'REJECTED'" }, { status: 400 });
    }

    // Update user status
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        status: action,
        approvedAt: action === "APPROVED" ? new Date() : null,
        approvedBy: action === "APPROVED" ? decoded.userId : null,
      },
      select: {
        id: true,
        name: true,
        surname: true,
        email: true,
        status: true,
        approvedAt: true,
      },
    });

    return NextResponse.json({
      message: `User ${action.toLowerCase()} successfully`,
      user: updatedUser,
    });
  } catch (error) {
    console.error("Approve user error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
