import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { requireUserSession } from "@/lib/session";
import { SiteNav } from "@/components/SiteNav";
import { EditProfileForm } from "@/components/EditProfileForm";

export const metadata: Metadata = {
  title: "Editar perfil · ReelRate",
};

export default async function EditarPerfilPage() {
  const session = await requireUserSession();
  if (!session) redirect("/login?callbackUrl=/perfil/editar");

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) redirect("/login");

  return (
    <div style={{ background: "#0a0a0e", minHeight: "100vh" }}>
      <SiteNav />
      <main style={{ padding: "140px 48px 80px", maxWidth: 480 }}>
        <h1
          style={{
            fontFamily: "var(--font-bebas), sans-serif",
            fontSize: 32,
            letterSpacing: 0.5,
            color: "#eeeae4",
            margin: "0 0 24px",
          }}
        >
          Editar perfil
        </h1>
        <EditProfileForm initialName={user.name} initialAvatarUrl={user.avatarUrl ?? ""} />
      </main>
    </div>
  );
}
