import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireUserSession, unauthorizedResponse } from "@/lib/session";

export async function GET() {
  const session = await requireUserSession();
  if (!session) return unauthorizedResponse();

  const reviews = await prisma.review.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json(reviews);
}
