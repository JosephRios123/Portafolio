import { useEffect, useRef } from "react";
import { TrendingUp, BookOpen, RefreshCw } from "lucide-react";

const learnings = [
  {
    name: "Java",
    emoji: "☕",
    status: "En curso",
    desc: "Profundizando en POO avanzada y ecosistema Spring",
    color: "hsl(27 100% 55%)",
    progress: 65,
  },
  {
    name: "Python",
    emoji: "🐍",
    status: "Entrenamiento activo",
    desc: "Automatización, scripting y data science básico",
    color: "hsl(45 100% 55%)",
    progress: 50,
  },
  {
    name: "Inglés",
    emoji: "🌍",
    status: "Mejora continua",
    desc: "Lectura técnica fluida, conversación en desarrollo",
    color: "hsl(217 91% 60%)",
    progress: 45,
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

export default function Learning() {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollAnimation(sectionRef);

  return (
    <section id="learning" ref={sectionRef} className="py-28 px-6 section-divider" style={{
      background: "radial-gradient(ellipse 70% 50% at 80% 50%, hsl(217 91% 60% / 0.05) 0%, transparent 60%)"
    }}>
      <div className="max-w-7xl mx-auto">
        <div className="animate-in-view flex items-center gap-3 mb-4">
          <span className="w-8 h-px gradient-bg" />
          <span className="text-accent text-sm font-mono font-bold tracking-widest uppercase">Aprendizaje</span>
        </div>

        <div className="flex items-center gap-3 mb-4">
          <RefreshCw size={20} className="text-primary animate-spin" style={{ animationDuration: "4s" }} />
          <h2 className="animate-in-view text-4xl sm:text-5xl font-black" style={{ transitionDelay: "0.1s" }}>
            Siempre en <span className="gradient-text">modo aprendizaje</span>
          </h2>
        </div>

        <p className="animate-in-view text-muted-foreground text-lg mb-16 max-w-xl" style={{ transitionDelay: "0.15s" }}>
          El conocimiento no tiene techo. Cada día es una oportunidad de sumar una nueva herramienta al arsenal.
        </p>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {learnings.map(({ name, emoji, status, desc, color, progress }, i) => (
            <div
              key={name}
              className="animate-in-view glass-card-hover rounded-2xl p-8"
              style={{ transitionDelay: `${0.1 + i * 0.1}s` }}
            >
              <div className="text-5xl mb-4">{emoji}</div>
              <h3 className="text-xl font-black text-foreground mb-1">{name}</h3>
              <span
                className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold mb-4"
                style={{ background: `${color}20`, color, border: `1px solid ${color}30` }}
              >
                {status}
              </span>
              <p className="text-sm text-muted-foreground mb-6">{desc}</p>

              {/* Progress bar */}
              <div>
                <div className="flex justify-between text-xs text-muted-foreground mb-2">
                  <span>Progreso</span>
                  <span className="font-bold" style={{ color }}>{progress}%</span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{
                      width: `${progress}%`,
                      background: `linear-gradient(90deg, ${color}, hsl(187 92% 42%))`,
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Motivational banner */}
        <div
          className="animate-in-view rounded-2xl p-8 text-center relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, hsl(217 91% 60% / 0.1), hsl(187 92% 42% / 0.1))",
            border: "1px solid hsl(217 91% 60% / 0.2)",
            transitionDelay: "0.4s",
          }}
        >
          <BookOpen size={28} className="text-accent mx-auto mb-4" />
          <TrendingUp size={20} className="text-primary absolute top-6 right-8 opacity-30" />
          <p className="text-xl font-bold text-foreground max-w-2xl mx-auto">
            "Un desarrollador que deja de aprender, deja de ser relevante. Yo elijo crecer."
          </p>
        </div>
      </div>
    </section>
  );
}
