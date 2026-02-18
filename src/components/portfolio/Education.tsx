import { useEffect, useRef } from "react";
import { GraduationCap, CheckCircle2, Calendar } from "lucide-react";

const competencies = [
  "Metodologías ágiles (SCRUM)",
  "Ciclo completo de desarrollo de software",
  "Testing y aseguramiento de calidad",
  "Programación orientada a objetos",
  "Enfoque en experiencia de usuario",
  "Análisis y diseño de sistemas",
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

        <div className="grid lg:grid-cols-5 gap-8 items-start">
          {/* Main card */}
          <div className="animate-in-view lg:col-span-3" style={{ transitionDelay: "0.15s" }}>
            <div
              className="glass-card rounded-2xl p-8 relative overflow-hidden"
              style={{ border: "1px solid hsl(217 91% 60% / 0.3)" }}
            >
              {/* Glow accent */}
              <div
                className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-10 blur-3xl"
                style={{ background: "hsl(217 91% 60%)" }}
              />

              <div className="flex items-start gap-5 mb-8">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shrink-0"
                  style={{
                    background: "hsl(217 91% 60% / 0.15)",
                    border: "1px solid hsl(217 91% 60% / 0.3)",
                  }}
                >
                  🏫
                </div>
                <div>
                  <h3 className="text-2xl font-black text-foreground">SENA</h3>
                  <p className="text-primary font-semibold mt-1">Servicio Nacional de Aprendizaje</p>
                  <p className="text-muted-foreground text-sm mt-0.5">Medellín, Colombia</p>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-lg font-bold text-foreground mb-2">
                  Tecnólogo en Análisis y Desarrollo de Software
                </h4>
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <Calendar size={14} className="text-accent" />
                  <span className="font-mono">Abr 2022 – Jul 2024</span>
                </div>
              </div>

              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold"
                style={{
                  background: "hsl(187 92% 42% / 0.15)",
                  color: "hsl(187 92% 42%)",
                  border: "1px solid hsl(187 92% 42% / 0.3)",
                }}
              >
                <GraduationCap size={16} />
                Graduado con éxito
              </div>
            </div>
          </div>

          {/* Competencies */}
          <div className="animate-in-view lg:col-span-2" style={{ transitionDelay: "0.2s" }}>
            <h3 className="text-lg font-black mb-5 text-foreground">Competencias adquiridas</h3>
            <ul className="flex flex-col gap-3">
              {competencies.map((c, i) => (
                <li
                  key={c}
                  className="animate-in-view flex items-start gap-3 p-4 glass-card rounded-xl"
                  style={{ transitionDelay: `${0.25 + i * 0.06}s` }}
                >
                  <CheckCircle2 size={18} className="text-accent mt-0.5 shrink-0" />
                  <span className="text-sm text-muted-foreground">{c}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
