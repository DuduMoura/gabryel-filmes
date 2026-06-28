"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        setError(data?.error ?? "Erro ao cadastrar");
        return;
      }

      router.push("/login");
    } catch {
      setLoading(false);
      setError("Erro de rede");
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(192,57,43,0.25),_transparent_40%),linear-gradient(135deg,_#050506,_#111114_55%,_#080809)] p-6 text-[#eeeae4]">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-black/80 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur">
        <div className="mb-8 space-y-3">
          <p className="text-sm uppercase tracking-[0.35em] text-[#c0392b]">ReelRate</p>
          <h1 className="text-3xl font-bold" style={{ fontFamily: "var(--font-bebas), sans-serif" }}>
            Criar conta
          </h1>
          <p className="text-sm text-[#b8b0a6]">Cadastre-se para guardar suas avaliações e acompanhar seus filmes.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-[#eeeae4]">Nome</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="block w-full rounded-lg border border-[#2f2f2f] bg-[#111114] px-3 py-3 text-[#f6f1eb] outline-none transition focus:border-[#c0392b]"
              placeholder="Seu nome"
              required
            />
          </div>

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
            {loading ? "Cadastrando..." : "Criar conta"}
          </button>
        </form>

        <p className="mt-6 text-sm text-[#b8b0a6]">
          Já tem conta? <Link className="font-semibold text-[#c0392b] hover:text-[#ff6b57]" href="/login">Entrar</Link>
        </p>
      </div>
    </main>
  );
}
