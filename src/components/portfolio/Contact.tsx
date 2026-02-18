import { useEffect, useRef } from "react";
import { Mail, Phone, Linkedin, ExternalLink, Send } from "lucide-react";

const contacts = [
  {
    icon: Mail,
    label: "Email",
    value: "cresposfelices@gmail.com",
    href: "mailto:cresposfelices@gmail.com",
    color: "hsl(217 91% 60%)",
  },
  {
    icon: Phone,
    label: "Teléfono",
    value: "+57 318 753 7304",
    href: "tel:+573187537304",
    color: "hsl(187 92% 42%)",
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
    value: "jose-manuel-rios-restrepo",
    href: "https://linkedin.com/in/jose-manuel-rios-restrepo-69ab691b4",
    color: "hsl(210 90% 55%)",
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
          {contacts.map(({ icon: Icon, label, value, href, color }, i) => (
            <a
              key={label}
              href={href}
              target={label === "LinkedIn" ? "_blank" : undefined}
              rel={label === "LinkedIn" ? "noopener noreferrer" : undefined}
              className="animate-in-view glass-card-hover rounded-2xl p-7 flex flex-col items-center text-center group"
              style={{ transitionDelay: `${0.2 + i * 0.1}s` }}
            >
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110"
                style={{
                  background: `${color}15`,
                  border: `1px solid ${color}30`,
                  boxShadow: `0 0 0 0 ${color}30`,
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

        {/* Big CTA */}
        <div className="animate-in-view text-center" style={{ transitionDelay: "0.5s" }}>
          <a
            href="mailto:cresposfelices@gmail.com"
            className="inline-flex items-center gap-3 px-10 py-5 rounded-full text-background font-black text-xl hover:opacity-90 hover:scale-105 transition-all duration-300"
            style={{
              background: "linear-gradient(135deg, hsl(217 91% 60%), hsl(187 92% 42%))",
              boxShadow: "0 0 60px hsl(217 91% 60% / 0.4), 0 16px 48px hsl(187 92% 42% / 0.2)",
            }}
          >
            <Send size={22} />
            Enviar mensaje
          </a>
        </div>

        {/* Footer */}
        <div className="mt-24 pt-8 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-muted-foreground text-sm">
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
