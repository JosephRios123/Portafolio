import { z } from "zod";

const urlOrEmpty = z
  .string()
  .trim()
  .refine((v) => v === "" || /^https?:\/\/\S+\.\S+/.test(v), {
    message: "URL inválida (debe empezar por http:// o https://)",
  });

export const projectSchema = z.object({
  name: z.string().trim().min(1, "Requerido").max(80, "Máx. 80 caracteres"),
  description: z.string().trim().min(1, "Requerido").max(200, "Máx. 200 caracteres"),
  tags: z.array(z.string().trim().min(1).max(24)).min(1, "Añade al menos 1 tag").max(10, "Máx. 10 tags"),
  link: urlOrEmpty,
  image_url: urlOrEmpty,
  country: z.string().trim().max(60),
  display_order: z.number().int(),
});

export const formationSchema = z.object({
  course: z.string().trim().min(1, "Requerido").max(120),
  institution: z.string().trim().min(1, "Requerido").max(120),
  city: z.string().trim().max(80),
  country: z.string().trim().max(60),
  status: z.enum(["Completado", "En progreso", "Certificado"]),
  obtained_date: z.string().trim().max(40),
  display_order: z.number().int(),
});

export const mindsetSchema = z.object({
  phrase: z.string().trim().min(1, "Requerido").max(120),
  description: z.string().trim().min(1, "Requerido").max(400),
  category: z.enum(["Técnica", "Humana", "Estratégica"]),
  display_order: z.number().int(),
});

export const experienceSchema = z
  .object({
    role: z.string().trim().min(1, "Requerido").max(120),
    company: z.string().trim().min(1, "Requerido").max(120),
    start_date: z.string().trim().min(1, "Requerido").max(40),
    end_date: z.string().trim().max(40),
    is_current: z.boolean(),
    color: z.string().trim().min(1),
    display_order: z.number().int(),
  })
  .refine((d) => d.is_current || d.end_date.trim().length > 0, {
    message: "Indica fecha de fin o marca 'actualidad'",
    path: ["end_date"],
  });

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const CERT_TYPES = ["application/pdf", "image/jpeg", "image/png"];
const MAX_BYTES = 2 * 1024 * 1024;

export function validateImageFile(file: File): string | null {
  if (!IMAGE_TYPES.includes(file.type)) return "Formato no permitido (usa JPG, PNG o WEBP)";
  if (file.size > MAX_BYTES) return "Imagen supera 2MB";
  return null;
}

export function validateCertificateFile(file: File): string | null {
  if (!CERT_TYPES.includes(file.type)) return "Formato no permitido (usa PDF, JPG o PNG)";
  if (file.size > MAX_BYTES) return "Archivo supera 2MB";
  return null;
}

export type ZodResultErrors = Record<string, string>;

export function flattenZodErrors<T>(result: z.SafeParseReturnType<T, T>): ZodResultErrors {
  if (result.success) return {};
  const out: ZodResultErrors = {};
  for (const issue of result.error.issues) {
    const key = issue.path.join(".") || "_";
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}
