/** Avatares pré-definidos disponíveis em /public/avatars para o usuário escolher no perfil. */
export const AVATAR_OPTIONS: readonly string[] = Array.from(
  { length: 8 },
  (_, i) => `/avatars/${i + 1}.png`,
);
