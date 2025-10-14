import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message, type } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Name, email, and message are required" }, { status: 400 });
    }

    const contactMessage = await prisma.contactMessage.create({
      data: {
        name: name.trim(),
        email: email.trim(),
        subject: subject?.trim() || "",
        message: message.trim(),
        type: type || "general",
        status: "new",
      },
    });

    // Here you could add email sending logic
    // await sendContactEmail({ name, email, subject, message, type });

    return NextResponse.json({
      success: true,
      message: "Contact message sent successfully",
      id: contactMessage.id,
    });
  } catch (error) {
    console.error("Error creating contact message:", error);
    return NextResponse.json(
      { error: "Failed to send contact message" },
      { status: 500 }
    );
  }
}
