import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { content, expiresInMinutes, maxViews } = body;

    if (!content || content.trim() === "") {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    let expiresAt: Date | null = null;

    if (expiresInMinutes) {
      expiresAt = new Date(Date.now() + expiresInMinutes * 60 * 1000);
    }

    const paste = await prisma.paste.create({
      data: {
        content,
        expiresAt,
        maxViews: maxViews ? Number(maxViews) : null,
      },
    });

    return NextResponse.json({
      id: paste.id,
      url: `/p/${paste.id}`,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}