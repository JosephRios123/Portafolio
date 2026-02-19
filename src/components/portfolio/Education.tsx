import { useEffect, useRef, useState } from "react";
import { GraduationCap, Calendar, ChevronDown } from "lucide-react";

const formations = [
  {
    title: "Tecnólogo en Análisis y Desarrollo de Software",
    institution: "SENA",
    institutionFull: "Servicio Nacional de Aprendizaje",
    location: "Medellín, Colombia",
    period: "Abr 2022 – Jul 2024",
    emoji: "🏫",
    color: "hsl(217 91% 60%)",
    status: "Graduado con éxito",
    competencies: [
      "Metodologías ágiles (SCRUM)",
      "Ciclo completo de desarrollo de software",
      "Testing y aseguramiento de calidad",
      "Programación orientada a objetos",
      "Enfoque en experiencia de usuario",
      "Análisis y diseño de sistemas",
    ],
  },
  {
    title: "Introducción a la IA Generativa",
    institution: "SENA",
    institutionFull: "Servicio Nacional de Aprendizaje",
    location: "Virtual",
    period: "2024",
    emoji: "🤖",
    color: "hsl(187 92% 42%)",
    status: "Completado",
    competencies: [
      "Comprensión de modelos generativos y su aplicación práctica",
      "Uso estratégico de herramientas basadas en IA",
      "Pensamiento crítico aplicado a automatización inteligente",
      "Integración de IA como herramienta de productividad en desarrollo",
    ],
  },
  {
    title: "Programación en JAVA",
    institution: "SENA",
    institutionFull: "Servicio Nacional de Aprendizaje",
    location: "Virtual",
    period: "2023",
    emoji: "☕",
    color: "hsl(27 100% 55%)",
    status: "Completado",
    competencies: [
      "Programación orientada a objetos avanzada",
      "Manejo de excepciones y arquitectura limpia",
      "Diseño modular y reutilizable",
      "Desarrollo de lógica robusta y estructurada",
    ],
  },
  {
    title: "Operador Medios Tecnológicos",
    institution: "SENA",
    institutionFull: "Servicio Nacional de Aprendizaje",
    location: "Medellín, Colombia",
    period: "2021",
    emoji: "🖥️",
    color: "hsl(262 83% 65%)",
    status: "Completado",
    competencies: [
      "Gestión de sistemas tecnológicos en entornos operativos",
      "Monitoreo y control de procesos digitales",
      "Responsabilidad en manejo de información",
      "Atención al detalle y reacción ante incidentes técnicos",
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

export default function Education() {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollAnimation(sectionRef);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section id="education" ref={sectionRef} className="py-28 px-6 section-divider">
      <div className="max-w-5xl mx-auto">
        <div className="animate-in-view flex items-center gap-3 mb-4">
          <span className="w-8 h-px gradient-bg" />
          <span className="text-accent text-sm font-mono font-bold tracking-widest uppercase">Formación</span>
        </div>

        <h2 className="animate-in-view text-4xl sm:text-5xl font-black mb-16" style={{ transitionDelay: "0.1s" }}>
          Base <span className="gradient-text">Académica</span>
        </h2>

        <div className="flex flex-col gap-5">
          {formations.map((f, i) => (
            <div
              key={f.title}
              className="animate-in-view glass-card-hover rounded-2xl overflow-hidden cursor-pointer"
              style={{ transitionDelay: `${0.15 + i * 0.08}s` }}
              onClick={() => toggle(i)}
            >
              <div className="p-7 sm:p-8">
                <div className="flex items-start gap-5">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0"
                    style={{
                      background: `${f.color}15`,
                      border: `1px solid ${f.color}30`,
                    }}
                  >
                    {f.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-black text-foreground">{f.title}</h3>
                        <p className="font-semibold mt-1" style={{ color: f.color }}>{f.institution}</p>
                        <p className="text-muted-foreground text-sm">{f.location}</p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <div className="hidden sm:flex items-center gap-1.5 text-muted-foreground text-sm font-mono">
                          <Calendar size={13} className="text-accent" />
                          {f.period}
                        </div>
                        <ChevronDown
                          size={20}
                          className="text-muted-foreground transition-transform duration-300"
                          style={{ transform: openIndex === i ? "rotate(180deg)" : "rotate(0deg)" }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-3 mt-3">
                      <span
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold"
                        style={{
                          background: `${f.color}15`,
                          color: f.color,
                          border: `1px solid ${f.color}30`,
                        }}
                      >
                        <GraduationCap size={13} />
                        {f.status}
                      </span>
                      <span className="sm:hidden text-xs text-muted-foreground font-mono">{f.period}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Accordion content */}
              <div
                className="overflow-hidden transition-all duration-500 ease-in-out"
                style={{
                  maxHeight: openIndex === i ? `${f.competencies.length * 60}px` : "0px",
                  opacity: openIndex === i ? 1 : 0,
                }}
              >
                <div className="px-7 sm:px-8 pb-7 sm:pb-8 pt-0">
                  <div className="border-t border-border/50 pt-5">
                    <p className="text-xs font-mono font-bold text-accent/80 tracking-widest uppercase mb-4">
                      Competencias adquiridas
                    </p>
                    <ul className="grid sm:grid-cols-2 gap-3">
                      {f.competencies.map((c) => (
                        <li key={c} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                          <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: f.color }} />
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
