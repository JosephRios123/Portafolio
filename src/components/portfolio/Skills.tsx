import { useEffect, useRef } from "react";
import { Brain, BarChart2, Users, MessageSquare, Lightbulb, ShieldCheck } from "lucide-react";

const softSkills = [
  {
    icon: Brain,
    name: "Resolución de Problemas",
    desc: "Analizo y descompongo problemas complejos en soluciones accionables.",
    color: "hsl(217 91% 60%)",
  },
  {
    icon: BarChart2,
    name: "Capacidad Analítica",
    desc: "Pensamiento estructurado para interpretar datos y tomar decisiones.",
    color: "hsl(187 92% 42%)",
  },
  {
    icon: Users,
    name: "Trabajo en Equipo",
    desc: "Colaboro de forma efectiva en equipos ágiles y multidisciplinarios.",
    color: "hsl(217 91% 60%)",
  },
  {
    icon: MessageSquare,
    name: "Comunicación Efectiva",
    desc: "Transmito ideas técnicas de forma clara a perfiles técnicos y no técnicos.",
    color: "hsl(187 92% 42%)",
  },
  {
    icon: Lightbulb,
    name: "Aprendizaje Continuo",
    desc: "Mentalidad de crecimiento constante y adaptación a nuevas tecnologías.",
    color: "hsl(217 91% 60%)",
  },
  {
    icon: ShieldCheck,
    name: "Testing & QA",
    desc: "Aseguro la calidad del software a través de pruebas rigurosas y documentación.",
    color: "hsl(187 92% 42%)",
  },
];

const languages = [
  { name: "Español", level: "Nativo", flag: "🇨🇴" },
  { name: "Inglés", level: "Intermedio (en mejora constante)", flag: "🇺🇸" },
];

const learnings = [
  {
    name: "Java",
    emoji: "☕",
    desc: "Profundizando en POO avanzada y ecosistema Spring",
    color: "hsl(27 100% 55%)",
  },
  {
    name: "Python",
    emoji: "🐍",
    desc: "Automatización, scripting y data science básico",
    color: "hsl(45 100% 55%)",
  },
  {
    name: "Inglés",
    emoji: "🌍",
    desc: "Lectura técnica fluida, conversación en desarrollo",
    color: "hsl(217 91% 60%)",
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

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollAnimation(sectionRef);

  return (
    <section id="skills" ref={sectionRef} className="py-20 sm:py-28 px-4 sm:px-6 section-divider">
      <div className="max-w-7xl mx-auto">
        {/* Soft Skills */}
        <div className="animate-in-view flex items-center gap-3 mb-4">
          <span className="w-8 h-px gradient-bg" />
          <span className="text-accent text-sm font-mono font-bold tracking-widest uppercase">Habilidades</span>
        </div>

        <h2 className="animate-in-view text-3xl sm:text-4xl md:text-5xl font-black mb-4" style={{ transitionDelay: "0.1s" }}>
          Habilidades <span className="gradient-text">Blandas</span>
        </h2>
        <p className="animate-in-view text-muted-foreground text-lg mb-16 max-w-xl" style={{ transitionDelay: "0.15s" }}>
          Las skills que diferencian a un buen developer de un gran profesional.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-24">
          {softSkills.map(({ icon: Icon, name, desc, color }, i) => (
            <div
              key={name}
              className="animate-in-view glass-card-hover rounded-2xl p-7 group"
              style={{ transitionDelay: `${0.05 * i}s` }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110"
                style={{ background: `${color}15`, border: `1px solid ${color}30` }}
              >
                <Icon size={22} style={{ color }} />
              </div>
              <h3 className="font-black text-foreground mb-2">{name}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        {/* Learning - elegant cards without progress bars */}
        <div className="animate-in-view flex items-center gap-3 mb-4" style={{ transitionDelay: "0.3s" }}>
          <span className="w-8 h-px gradient-bg" />
          <span className="text-accent text-sm font-mono font-bold tracking-widest uppercase">Aprendizaje Activo</span>
        </div>

        <h2 className="animate-in-view text-3xl sm:text-4xl md:text-5xl font-black mb-8 sm:mb-12" style={{ transitionDelay: "0.35s" }}>
          Siempre en <span className="gradient-text">modo aprendizaje</span>
        </h2>

        <div className="grid sm:grid-cols-3 gap-5 mb-24">
          {learnings.map(({ name, emoji, desc, color }, i) => (
            <div
              key={name}
              className="animate-in-view glass-card-hover rounded-2xl p-8 group"
              style={{ transitionDelay: `${0.4 + i * 0.08}s` }}
            >
              <div className="text-4xl mb-4">{emoji}</div>
              <h3 className="text-xl font-black text-foreground mb-2">{name}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              <div
                className="mt-5 h-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 w-0 group-hover:w-full"
                style={{ background: `linear-gradient(90deg, ${color}, transparent)` }}
              />
            </div>
          ))}
        </div>

        {/* Languages */}
        <div className="animate-in-view flex items-center gap-3 mb-4" style={{ transitionDelay: "0.5s" }}>
          <span className="w-8 h-px gradient-bg" />
          <span className="text-accent text-sm font-mono font-bold tracking-widest uppercase">Idiomas</span>
        </div>

        <h2 className="animate-in-view text-3xl sm:text-4xl md:text-5xl font-black mb-8 sm:mb-12" style={{ transitionDelay: "0.55s" }}>
          <span className="gradient-text">Lenguajes</span> que domino
        </h2>

        <div className="grid sm:grid-cols-2 gap-6 max-w-2xl">
          {languages.map(({ name, level, flag }, i) => (
            <div
              key={name}
              className="animate-in-view glass-card-hover rounded-2xl p-7"
              style={{ transitionDelay: `${0.6 + i * 0.1}s` }}
            >
              <div className="flex items-center gap-4">
                <span className="text-4xl">{flag}</span>
                <div>
                  <div className="font-black text-foreground text-lg">{name}</div>
                  <div className="text-sm text-muted-foreground">{level}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
