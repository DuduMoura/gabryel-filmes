import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireUserSession, unauthorizedResponse, forbiddenResponse, notFoundResponse, badRequestResponse } from "@/lib/session";
import { reviewSchema } from "@/lib/validations";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  const session = await requireUserSession();
  if (!session) return unauthorizedResponse();

  const reviewId = params.id;
  if (!reviewId) return badRequestResponse("ID da avaliação inválido");

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return badRequestResponse("Corpo JSON inválido");
  }

  const parsed = reviewSchema.partial().safeParse(body);
  if (!parsed.success) {
    return badRequestResponse(parsed.error.errors[0]?.message ?? "Entrada inválida");
  }

  if (Object.keys(parsed.data).length === 0) {
    return badRequestResponse("Nenhum campo para atualizar");
  }

  const review = await prisma.review.findUnique({ where: { id: reviewId } });
  if (!review) {
    return notFoundResponse("Avaliação");
  }

  if (review.userId !== session.user.id) {
    return forbiddenResponse();
  }

  const updateData: { rating?: number; comment?: string | null } = {};
  if (parsed.data.rating !== undefined) updateData.rating = parsed.data.rating;
  if (parsed.data.comment !== undefined) updateData.comment = parsed.data.comment;

  const updatedReview = await prisma.review.update({
    where: { id: reviewId },
    data: updateData,
  });

  return NextResponse.json(updatedReview);
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {
  const session = await requireUserSession();
  if (!session) return unauthorizedResponse();

  const reviewId = params.id;
  if (!reviewId) return badRequestResponse("ID da avaliação inválido");

  const review = await prisma.review.findUnique({ where: { id: reviewId } });
  if (!review) {
    return notFoundResponse("Avaliação");
  }

  if (review.userId !== session.user.id) {
    return forbiddenResponse();
  }

  await prisma.review.delete({ where: { id: reviewId } });
  return new NextResponse(null, { status: 204 });
}
