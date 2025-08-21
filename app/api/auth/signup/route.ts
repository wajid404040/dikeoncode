import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { name, surname, email, password } = await request.json();

    if (!name || !surname || !email || !password) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json({ message: "User with this email already exists" }, { status: 409 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user with WAITLIST status
    const user = await prisma.user.create({
      data: {
        name,
        surname,
        email: email.toLowerCase(),
        password: hashedPassword,
        status: "WAITLIST",
        selectedVoice: null, // Will be set during personalization
      },
    });

    // Return user data (without password)
    const { password: _, ...userData } = user;
    return NextResponse.json(
      {
        message: "User registered successfully. Please wait for admin approval.",
        user: userData,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
