import { z } from "zod";

export const CreateDoadorBody = z.object({
  nome: z.string().max(100),
  email: z.string().email("O email deve ser valido"),
  telefone: z
    .string()
    .regex(/^\(\d{2}\)\s{1}(\d\s|)\d{4}-\d{4}$/gm, "O telefone deve ser valido (XX) XXXX-XXXX ou (XX) X XXXX-XXXX"),
});

export const UpdateDoadorBody = z.object({
  nome: z.string().max(100, "O nome deve ter no maximo 100 caracteres").optional(),
  email: z.string().email("O email deve ser valido").optional(),
  telefone: z
    .string()
    .regex(/^\(\d{2}\)\s{1}(\d\s|)\d{4}-\d{4}$/gm, "O telefone deve ser valido (XX) XXXX-XXXX ou (XX) X XXXX-XXXX")
    .optional(),
});
