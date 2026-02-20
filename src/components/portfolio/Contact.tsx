import { useEffect, useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { Mail, MessageSquare, Linkedin, ExternalLink, Send, User, AtSign, CheckCircle, AlertCircle, Loader2, Download } from "lucide-react";
import { generateCV } from "@/lib/generateCV";
import { z } from "zod";

// ─── EmailJS config ────────────────────────────────────────────────────────────
// Replace these with your real EmailJS credentials
const EMAILJS_SERVICE_ID  = "service_63fvkqq";   // e.g. "service_abc123"
const EMAILJS_TEMPLATE_ID = "template_3wfaklf";  // e.g. "template_xyz789"
const EMAILJS_PUBLIC_KEY  = "THBM1IILucHMWfU4Y";   // e.g. "AbCdEfGhIjKlMnOp"
// ──────────────────────────────────────────────────────────────────────────────

const contactSchema = z.object({
  name: z.string().trim().min(2, "El nombre debe tener al menos 2 caracteres").max(100),
  email: z.string().trim().email("Correo electrónico inválido").max(255),
  message: z.string().trim().min(10, "El mensaje debe tener al menos 10 caracteres").max(2000),
});

type FormData = { name: string; email: string; message: string };
type Status = "idle" | "sending" | "success" | "error";

const contacts = [
  {
    icon: Mail,
    label: "Email",
    value: "cresposfelices@gmail.com",
    href: "mailto:cresposfelices@gmail.com",
    color: "hsl(217 91% 60%)",
  },
  {
    icon: MessageSquare,
    label: "WhatsApp",
    value: "+57 318 753 7304",
    href: "https://wa.me/573187537304",
    color: "hsl(142 70% 45%)",
    external: true,
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
    value: "jose-manuel-rios-restrepo",
    href: "https://linkedin.com/in/jose-manuel-rios-restrepo-69ab691b4",
    color: "hsl(210 90% 55%)",
    external: true,
  },
];

function useScrollAnimation(ref: React.RefObject<HTMLElement>) {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("visible")),
      { threshold: 0.1 }
    );
    ref.current?.querySelectorAll(".animate-in-view").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [ref]);
}

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollAnimation(sectionRef);

  const [form, setForm] = useState<FormData>({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [status, setStatus] = useState<Status>("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = contactSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Partial<FormData> = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as keyof FormData;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setStatus("sending");
    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name: result.data.name,
          from_email: result.data.email,
          message: result.data.message,
          to_email: "cresposfelices@gmail.com",
        },
        EMAILJS_PUBLIC_KEY
      );
      setStatus("success");
      setForm({ name: "", email: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="contact" ref={sectionRef} className="py-28 px-6 section-divider relative overflow-hidden">
      {/* Background gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 100%, hsl(217 91% 60% / 0.12) 0%, transparent 60%), radial-gradient(ellipse 40% 30% at 80% 20%, hsl(187 92% 42% / 0.08) 0%, transparent 50%)",
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Header */}
        <div className="animate-in-view flex items-center gap-3 mb-4">
          <span className="w-8 h-px gradient-bg" />
          <span className="text-accent text-sm font-mono font-bold tracking-widest uppercase">Contacto</span>
        </div>

        <h2
          className="animate-in-view text-4xl sm:text-5xl md:text-6xl font-black mb-6 leading-tight"
          style={{ transitionDelay: "0.1s" }}
        >
          ¿Listo para construir{" "}
          <span className="gradient-text">algo grande</span> juntos?
        </h2>

        <p
          className="animate-in-view text-muted-foreground text-lg mb-16 max-w-2xl"
          style={{ transitionDelay: "0.15s" }}
        >
          Estoy disponible para roles de backend developer, consultoría técnica o proyectos desafiantes. Hablemos.
        </p>

        {/* Contact cards */}
        <div className="grid sm:grid-cols-3 gap-5 mb-16">
          {contacts.map(({ icon: Icon, label, value, href, color, external }, i) => (
            <a
              key={label}
              href={href}
              target={external ? "_blank" : undefined}
              rel={external ? "noopener noreferrer" : undefined}
              className="animate-in-view glass-card-hover rounded-2xl p-7 flex flex-col items-center text-center group"
              style={{ transitionDelay: `${0.2 + i * 0.1}s` }}
            >
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110"
                style={{
                  background: `${color}15`,
                  border: `1px solid ${color}30`,
                }}
              >
                <Icon size={24} style={{ color }} />
              </div>
              <div className="text-xs text-muted-foreground font-mono mb-2 tracking-widest uppercase">{label}</div>
              <div className="font-bold text-foreground text-sm group-hover:text-primary transition-colors break-all">
                {value}
              </div>
              <ExternalLink
                size={14}
                className="text-muted-foreground mt-3 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ color }}
              />
            </a>
          ))}
        </div>

        {/* Contact Form */}
        <div
          className="animate-in-view glass-card rounded-3xl p-8 sm:p-12"
          style={{ transitionDelay: "0.5s" }}
        >
          <h3 className="text-2xl font-black mb-2 text-foreground">Envíame un mensaje</h3>
          <p className="text-muted-foreground text-sm mb-8">
            Completa el formulario y te respondo directamente a tu correo.
          </p>

          {status === "success" ? (
            <div className="flex flex-col items-center gap-4 py-12 text-center">
              <CheckCircle size={52} className="text-green-400" />
              <p className="text-xl font-bold text-foreground">¡Mensaje enviado con éxito!</p>
              <p className="text-muted-foreground text-sm">Gracias por escribirme, te responderé pronto.</p>
              <button
                onClick={() => setStatus("idle")}
                className="mt-4 text-sm text-accent underline underline-offset-4"
              >
                Enviar otro mensaje
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2" htmlFor="name">
                  <User size={14} className="inline mr-1.5 text-accent" />
                  Nombre completo
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Tu nombre"
                  maxLength={100}
                  className={`w-full px-4 py-3 rounded-xl bg-background/50 border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/60 transition-all ${
                    errors.name ? "border-destructive" : "border-border"
                  }`}
                />
                {errors.name && (
                  <p className="mt-1.5 text-xs text-destructive flex items-center gap-1">
                    <AlertCircle size={12} /> {errors.name}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2" htmlFor="email">
                  <AtSign size={14} className="inline mr-1.5 text-accent" />
                  Correo electrónico
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="tucorreo@ejemplo.com"
                  maxLength={255}
                  className={`w-full px-4 py-3 rounded-xl bg-background/50 border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/60 transition-all ${
                    errors.email ? "border-destructive" : "border-border"
                  }`}
                />
                {errors.email && (
                  <p className="mt-1.5 text-xs text-destructive flex items-center gap-1">
                    <AlertCircle size={12} /> {errors.email}
                  </p>
                )}
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2" htmlFor="message">
                  <MessageSquare size={14} className="inline mr-1.5 text-accent" />
                  Mensaje
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Cuéntame sobre tu proyecto o propuesta..."
                  rows={5}
                  maxLength={2000}
                  className={`w-full px-4 py-3 rounded-xl bg-background/50 border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/60 transition-all resize-none ${
                    errors.message ? "border-destructive" : "border-border"
                  }`}
                />
                <div className="flex items-start justify-between mt-1.5">
                  {errors.message ? (
                    <p className="text-xs text-destructive flex items-center gap-1">
                      <AlertCircle size={12} /> {errors.message}
                    </p>
                  ) : (
                    <span />
                  )}
                  <span className="text-xs text-muted-foreground">{form.message.length}/2000</span>
                </div>
              </div>

              {/* Error banner */}
              {status === "error" && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-sm">
                  <AlertCircle size={16} />
                  Hubo un error al enviar. Por favor intenta de nuevo o escríbeme directamente.
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={status === "sending"}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-10 py-4 rounded-full text-background font-black text-base hover:opacity-90 hover:scale-[1.02] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
                style={{
                  background: "linear-gradient(135deg, hsl(217 91% 60%), hsl(187 92% 42%))",
                  boxShadow: "0 0 40px hsl(217 91% 60% / 0.35), 0 12px 32px hsl(187 92% 42% / 0.2)",
                }}
              >
                {status === "sending" ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send size={20} />
                    Enviar mensaje
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Download CV subtle */}
        <div className="animate-in-view mt-12 flex justify-center" style={{ transitionDelay: "0.6s" }}>
          <button
            onClick={() => generateCV()}
            className="group inline-flex items-center gap-3 px-6 py-3 rounded-full glass-card-hover text-sm font-bold text-accent hover:text-primary transition-colors"
          >
            <Download size={16} className="group-hover:translate-y-0.5 transition-transform" />
            Descargar mi CV en PDF
          </button>
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-muted-foreground text-sm">
          <p>
            Diseñado con <span className="text-accent">❤️</span> por{" "}
            <span className="text-foreground font-semibold">Jose Manuel Rios Restrepo</span>
          </p>
          <p className="font-mono">© {new Date().getFullYear()} · All rights reserved</p>
        </div>
      </div>
    </section>
  );
}
