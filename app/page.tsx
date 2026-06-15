export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8 text-center">
      <span className="text-5xl" role="img" aria-label="claquete">
        🎬
      </span>
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">ReelRate</h1>
      <p className="max-w-md text-lg text-gray-500">
        Avalie filmes e descubra a opinião da comunidade.
      </p>
      <p className="rounded-full border border-gray-300 px-4 py-1 text-sm text-gray-500 dark:border-gray-700">
        Fundação do projeto pronta · em desenvolvimento
      </p>
    </main>
  );
}
