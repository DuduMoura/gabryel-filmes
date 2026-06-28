import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireUserSession, unauthorizedResponse, badRequestResponse } from "@/lib/session";
import { reviewSchema } from "@/lib/validations";

export async function POST(
  req: Request,
  { params }: { params: { tmdbId: string } },
) {
  const session = await requireUserSession();
  if (!session) return unauthorizedResponse();

  const tmdbMovieId = Number(params.tmdbId);
  if (!Number.isInteger(tmdbMovieId) || tmdbMovieId <= 0) {
    return badRequestResponse("ID do filme inválido");
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return badRequestResponse("Corpo JSON inválido");
  }

  const parsed = reviewSchema.safeParse(body);
  if (!parsed.success) {
    return badRequestResponse(parsed.error.errors[0]?.message ?? "Entrada inválida");
  }

  const existingReview = await prisma.review.findUnique({
    where: {
      userId_tmdbMovieId: {
        userId: session.user.id,
        tmdbMovieId,
      },
    },
  });

  if (existingReview) {
    return NextResponse.json(
      {
        error: {
          code: "ALREADY_REVIEWED",
          message: "Você já avaliou este filme",
        },
      },
      { status: 409 },
    );
  }

  const review = await prisma.review.create({
    data: {
      rating: parsed.data.rating,
      comment: parsed.data.comment ?? null,
      tmdbMovieId,
      userId: session.user.id,
    },
  });

  return NextResponse.json(review, { status: 201 });
}
