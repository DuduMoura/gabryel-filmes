"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

function sanitizeCallbackUrl(value: string | null): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return "/";
  return value;
}

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { status } = useSession();
  const callbackUrl = sanitizeCallbackUrl(useSearchParams().get("callbackUrl"));

  useEffect(() => {
    if (status === "authenticated") {
      router.replace(callbackUrl);
    }
  }, [router, status, callbackUrl]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      setLoading(false);

      if (!res) {
        setError("Falha ao conectar ao servidor. Tente novamente.");
        return;
      }

      if (res.error) {
        if (res.error === "CredentialsSignin") {
          setError("E-mail ou senha inválidos");
        } else {
          setError(res.error);
        }
        return;
      }

      if (!res.ok) {
        setError("Não foi possível efetuar login. Tente novamente.");
        return;
      }

      router.push(callbackUrl);
    } catch (error) {
      setLoading(false);
      setError("Erro inesperado. Tente novamente mais tarde.");
      console.error("Login error:", error);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(192,57,43,0.25),_transparent_40%),linear-gradient(135deg,_#050506,_#111114_55%,_#080809)] p-6 text-[#eeeae4]">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-black/80 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur">
        <div className="mb-8 space-y-3">
          <p className="text-sm uppercase tracking-[0.35em] text-[#c0392b]">ReelRate</p>
          <h1 className="text-3xl font-bold" style={{ fontFamily: "var(--font-bebas), sans-serif" }}>
            Entrar na conta
          </h1>
          <p className="text-sm text-[#b8b0a6]">Acesse sua conta para continuar avaliando filmes.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-[#eeeae4]">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full rounded-lg border border-[#2f2f2f] bg-[#111114] px-3 py-3 text-[#f6f1eb] outline-none transition focus:border-[#c0392b]"
              placeholder="seu@email.com"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#eeeae4]">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full rounded-lg border border-[#2f2f2f] bg-[#111114] px-3 py-3 text-[#f6f1eb] outline-none transition focus:border-[#c0392b]"
              placeholder="••••••••"
              required
            />
          </div>

          {error && <p className="text-sm text-[#ff7b72]">{error}</p>}

          <button
            type="submit"
            className="w-full rounded-lg bg-[#c0392b] px-4 py-3 font-semibold text-white transition hover:bg-[#a62f21] disabled:cursor-not-allowed disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <p className="mt-6 text-sm text-[#b8b0a6]">
          Não tem conta? <Link className="font-semibold text-[#c0392b] hover:text-[#ff6b57]" href="/register">Criar conta</Link>
        </p>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
