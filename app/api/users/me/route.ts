import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireUserSession, unauthorizedResponse, badRequestResponse } from "@/lib/session";
import { updateProfileSchema } from "@/lib/validations";

export async function PATCH(req: Request) {
  const session = await requireUserSession();
  if (!session) return unauthorizedResponse();

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return badRequestResponse("Corpo JSON inválido");
  }

  const parsed = updateProfileSchema.safeParse(body);
  if (!parsed.success) {
    return badRequestResponse(parsed.error.errors[0]?.message ?? "Entrada inválida");
  }

  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name: parsed.data.name,
      ...(parsed.data.avatarUrl !== undefined ? { avatarUrl: parsed.data.avatarUrl || null } : {}),
    },
  });

  return NextResponse.json({ id: user.id, name: user.name, email: user.email, avatarUrl: user.avatarUrl });
}
