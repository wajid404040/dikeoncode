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
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ message: "Email parameter is required" }, { status: 400 });
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      select: {
        id: true,
        name: true,
        surname: true,
        email: true,
        status: true,
        selectedAvatar: true,
      },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Check if user is approved
    if (user.status !== "APPROVED") {
      return NextResponse.json({ message: "User is not approved" }, { status: 403 });
    }

    // Check if trying to find self
    if (user.id === decoded.userId) {
      return NextResponse.json({ message: "Cannot send friend request to yourself" }, { status: 400 });
    }

    return NextResponse.json({
      message: "User found successfully",
      user: {
        ...user,
        fullName: `${user.name} ${user.surname}`,
      },
    });
  } catch (error) {
    console.error("Find user error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
