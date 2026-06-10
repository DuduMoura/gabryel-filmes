import { z } from "zod";

/**
 * Schemas de validação compartilhados (validação server-side com Zod).
 * Centralizados aqui para reuso entre Route Handlers, Server Actions e o NextAuth.
 */

// Usado agora pelo authorize() do NextAuth (login).
export const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(1, "Senha obrigatória"),
});

// Para a issue de cadastro (RF-01).
export const registerSchema = z.object({
  name: z.string().min(2, "Nome muito curto").max(80),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(8, "A senha deve ter ao menos 8 caracteres"),
});

// Para a issue de avaliações (RF-04). RN-02: nota inteira de 1 a 5.
export const reviewSchema = z.object({
  rating: z.number().int().min(1, "Nota mínima é 1").max(5, "Nota máxima é 5"),
  comment: z.string().max(2000).optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;
