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

    // Check if user is the specific admin
    const adminUser = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { status: true, email: true },
    });

    if (!adminUser || adminUser.status !== "APPROVED" || adminUser.email !== "admin@dia.com") {
      return NextResponse.json({ message: "Access denied. Admin privileges required." }, { status: 403 });
    }

    // Get all waitlist users
    const waitlistUsers = await prisma.user.findMany({
      where: { status: "WAITLIST" },
      select: {
        id: true,
        name: true,
        surname: true,
        email: true,
        createdAt: true,
      },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({
      message: "Waitlist users retrieved successfully",
      users: waitlistUsers.map((user) => ({
        ...user,
        fullName: `${user.name} ${user.surname}`,
      })),
    });
  } catch (error) {
    console.error("Get waitlist error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
