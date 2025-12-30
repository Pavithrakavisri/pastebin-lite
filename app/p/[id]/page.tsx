import { prisma } from "@/lib/prisma";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const paste = await prisma.paste.findUnique({
    where: { id },
  });

  // ❌ Paste not found
  if (!paste) {
    return <div>Paste not found</div>;
  }

  // ⏰ Time expiry check
  if (paste.expiresAt && paste.expiresAt < new Date()) {
    return <div>Paste expired</div>;
  }

  // 👀 Max views check
  if (paste.maxViews && paste.views >= paste.maxViews) {
    return <div>Paste expired (max views reached)</div>;
  }

  // 👆 Increment views ONLY if valid
  const updatedPaste = await prisma.paste.update({
    where: { id },
    data: {
      views: { increment: 1 },
    },
  });

  return (
    <div>
      <h1>Paste</h1>
      <p>Views: {updatedPaste.views}</p>
      <pre>{updatedPaste.content}</pre>
    </div>
  );
}