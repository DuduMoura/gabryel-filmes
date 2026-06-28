import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

import { authOptions } from "@/lib/auth";

export async function requireUserSession() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return null;
  }
  return session;
}

export function unauthorizedResponse() {
  return NextResponse.json(
    {
      error: {
        code: "AUTH_REQUIRED",
        message: "Autenticação obrigatória",
      },
    },
    { status: 401 },
  );
}

export function forbiddenResponse() {
  return NextResponse.json(
    {
      error: {
        code: "FORBIDDEN",
        message: "Permissão negada",
      },
    },
    { status: 403 },
  );
}

export function notFoundResponse(message = "Recurso não encontrado") {
  return NextResponse.json(
    {
      error: {
        code: "NOT_FOUND",
        message,
      },
    },
    { status: 404 },
  );
}

export function badRequestResponse(message = "Entrada inválida") {
  return NextResponse.json(
    {
      error: {
        code: "BAD_REQUEST",
        message,
      },
    },
    { status: 400 },
  );
}
