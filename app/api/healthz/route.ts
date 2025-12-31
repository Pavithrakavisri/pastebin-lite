export const dynamic = "force-dynamic";
export const runtime="nodejs";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // DB connect test
    await prisma.paste.findFirst();

    return NextResponse.json(
      { ok: true },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { ok: false },
      { status: 500 }
    );
  }
}