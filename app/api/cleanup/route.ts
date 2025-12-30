import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const now = new Date();

    // ⏰ Delete time-expired pastes
    const expiredByTime = await prisma.paste.deleteMany({
      where: {
        expiresAt: {
          not: null,
          lt: now,
        },
      },
    });

    // 👀 Delete max-view reached pastes
    const expiredByViews = await prisma.paste.deleteMany({
      where: {
        maxViews: {
          not: null,
        },
        views: {
          gte: prisma.paste.fields.maxViews,
        },
      },
    });

    return NextResponse.json({
      deletedByTime: expiredByTime.count,
      deletedByViews: expiredByViews.count,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Cleanup failed" },
      { status: 500 }
    );
  }
}