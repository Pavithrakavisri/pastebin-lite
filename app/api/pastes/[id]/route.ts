import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
    try {
  const { id } = await params;

  const paste = await prisma.paste.findUnique({
    where: { id },
  });

    if (!paste) {
      return NextResponse.json(
        { error: "Paste not found" },
        { status: 404 }
      );
    }

    // --- Deterministic time (for tests) ---
    let now = new Date();
    if (process.env.TEST_MODE === "1") {
      const testNow = req.headers.get("x-test-now-ms");
      if (testNow) {
        now = new Date(Number(testNow));
      }
    }

    // --- TTL check ---
    if (paste.expiresAt && now > paste.expiresAt) {
      return NextResponse.json(
        { error: "Paste expired" },
        { status: 404 }
      );
    }

    // --- View limit check ---
    if (paste.maxViews !== null && paste.views >= paste.maxViews) {
      return NextResponse.json(
        { error: "View limit exceeded" },
        { status: 404 }
      );
    }

    // Increment view count
    const updated = await prisma.paste.update({
      where: { id: paste.id },
      data: { views: paste.views + 1 },
    });

    return NextResponse.json(
      {
        content: updated.content,
        remaining_views:
          updated.maxViews !== null
            ? updated.maxViews - updated.views
            : null,
        expires_at: updated.expiresAt,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}