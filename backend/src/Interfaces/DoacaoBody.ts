import { z } from "zod";

export const CreateDoacaoBody = z.object({
  valor: z
    .number({ required_error: "O valor e obrigatorio" })
    .min(5, "O valor deve ser maior que 5")
    .max(10000, "O valor deve ser menor que 10000"),
  mensagem: z.string().max(200).optional(),
  doadorId: z.string({ required_error: "O Id do doador e obrigatorio" }),
});

export const UpdateDoacaoBody = z.object({
  valor: z
    .number({ required_error: "O valor e obrigatorio" })
    .min(5, "O valor deve ser maior que 5")
    .max(10000, "O valor deve ser menor que 10000")
    .optional(),
  mensagem: z.string().max(200).optional(),
  doadorId: z.string({ required_error: "O Id do doador e obrigatorio" }).optional(),
});
