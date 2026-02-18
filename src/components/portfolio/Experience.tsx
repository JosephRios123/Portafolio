import { useEffect, useRef } from "react";
import { CheckCircle2, Calendar, Building2 } from "lucide-react";

const experiences = [
  {
    role: "Desarrollador de Software & Tester",
    company: "Visual Contact S.A.S",
    period: "Ene 2023 – Jul 2024",
    current: false,
    color: "hsl(217 91% 60%)",
    achievements: [
      "Diseño de historias de usuario y documentación técnica",
      "Testing y aseguramiento de calidad del software",
      "Desarrollo backend con PHP y Laravel",
      "Integración con .NET Core 6+ en ecosistemas empresariales",
      "Gestión y optimización de bases de datos MySQL",
      "Trabajo colaborativo en equipos ágiles (SCRUM)",
    ],
  },
  {
    role: "Soporte y Mantenimiento de Equipos HP",
    company: "Soporte Caribe S.A.S",
    period: "Feb 2025 – Presente",
    current: true,
    color: "hsl(187 92% 42%)",
    achievements: [
      "Soporte técnico empresarial de alto nivel",
      "Mantenimiento físico de equipos EliteBook G9 y G10",
      "Instalación y actualización de BIOS y drivers corporativos",
      "Formateos seguros con KillDisk y protocolos de seguridad",
      "Resolución eficiente de incidencias técnicas críticas",
    ],
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

export default function Experience() {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollAnimation(sectionRef);

  return (
    <section id="experience" ref={sectionRef} className="py-28 px-6 section-divider">
      <div className="max-w-5xl mx-auto">
        <div className="animate-in-view flex items-center gap-3 mb-4">
          <span className="w-8 h-px gradient-bg" />
          <span className="text-accent text-sm font-mono font-bold tracking-widest uppercase">Experiencia</span>
        </div>

        <h2 className="animate-in-view text-4xl sm:text-5xl font-black mb-16" style={{ transitionDelay: "0.1s" }}>
          Trayectoria <span className="gradient-text">Profesional</span>
        </h2>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-accent to-transparent hidden sm:block" />

          <div className="flex flex-col gap-12">
            {experiences.map(({ role, company, period, current, color, achievements }, i) => (
              <div key={company} className="animate-in-view sm:pl-20 relative" style={{ transitionDelay: `${0.1 * i}s` }}>
                {/* Timeline dot */}
                <div
                  className="absolute left-3.5 top-6 w-5 h-5 rounded-full border-2 border-background hidden sm:flex items-center justify-center"
                  style={{ background: color, boxShadow: `0 0 16px ${color}` }}
                >
                  {current && (
                    <span className="w-2 h-2 rounded-full bg-background animate-pulse" />
                  )}
                </div>

                <div className="glass-card-hover rounded-2xl p-8">
                  {/* Header */}
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                    <div>
                      <h3 className="text-xl font-black text-foreground mb-2">{role}</h3>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Building2 size={14} style={{ color }} />
                        <span className="font-semibold" style={{ color }}>{company}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full glass-card text-xs font-mono text-muted-foreground">
                        <Calendar size={12} />
                        {period}
                      </div>
                      {current && (
                        <span
                          className="px-3 py-1 rounded-full text-xs font-bold"
                          style={{ background: `${color}20`, color, border: `1px solid ${color}40` }}
                        >
                          ● Actual
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Achievements */}
                  <ul className="grid sm:grid-cols-2 gap-3">
                    {achievements.map((a) => (
                      <li key={a} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                        <CheckCircle2 size={15} className="mt-0.5 shrink-0" style={{ color }} />
                        {a}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
