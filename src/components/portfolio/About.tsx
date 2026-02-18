import { useEffect, useRef } from "react";
import { Briefcase, Code2, Building2, Award } from "lucide-react";

const metrics = [
  { icon: Briefcase, label: "Años de experiencia", value: "2+" },
  { icon: Code2, label: "Tecnologías dominadas", value: "9+" },
  { icon: Building2, label: "Empresas", value: "2" },
  { icon: Award, label: "Metodología", value: "SCRUM" },
];

function useScrollAnimation(ref: React.RefObject<HTMLElement>) {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.15 }
    );
    const elements = ref.current?.querySelectorAll(".animate-in-view");
    elements?.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [ref]);
}

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollAnimation(sectionRef);

  return (
    <section id="about" ref={sectionRef} className="py-28 px-6 section-divider">
      <div className="max-w-7xl mx-auto">
        {/* Section label */}
        <div className="animate-in-view flex items-center gap-3 mb-4">
          <span className="w-8 h-px gradient-bg" />
          <span className="text-accent text-sm font-mono font-bold tracking-widest uppercase">Sobre Mí</span>
        </div>

        <h2 className="animate-in-view text-4xl sm:text-5xl font-black mb-16 leading-tight" style={{ transitionDelay: "0.1s" }}>
          Estrategia + <span className="gradient-text">Código</span>
        </h2>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Avatar side */}
          <div className="animate-in-view order-2 lg:order-1 flex justify-center" style={{ transitionDelay: "0.15s" }}>
            <div className="relative">
              {/* Glow rings */}
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background: "conic-gradient(from 0deg, hsl(217 91% 60%), hsl(187 92% 42%), hsl(217 91% 60%))",
                  animation: "spin 8s linear infinite",
                  padding: "2px",
                  borderRadius: "9999px",
                }}
              />
              <div
                className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-full flex items-center justify-center glass-card"
                style={{ border: "none" }}
              >
                <div
                  className="w-60 h-60 sm:w-76 sm:h-76 rounded-full flex items-center justify-center"
                  style={{
                    background: "radial-gradient(circle at 35% 35%, hsl(217 91% 60% / 0.2), hsl(187 92% 42% / 0.1))",
                    boxShadow: "inset 0 0 40px hsl(217 91% 60% / 0.1)",
                  }}
                >
                  <div className="text-center">
                    <div className="text-7xl mb-2">👨‍💻</div>
                    <div className="text-xs font-mono text-accent/70">&lt;developer /&gt;</div>
                  </div>
                </div>
              </div>
              {/* Floating badges */}
              <div
                className="absolute -top-4 -right-4 px-3 py-1.5 glass-card rounded-full text-xs font-bold text-primary border-primary/30"
                style={{ animation: "float 3s ease-in-out infinite" }}
              >
                PHP · Laravel
              </div>
              <div
                className="absolute -bottom-4 -left-4 px-3 py-1.5 glass-card rounded-full text-xs font-bold text-accent"
                style={{ animation: "float 3s ease-in-out 1.5s infinite" }}
              >
                C# · .NET
              </div>
            </div>
          </div>

          {/* Text side */}
          <div className="animate-in-view order-1 lg:order-2" style={{ transitionDelay: "0.2s" }}>
            <div className="glass-card rounded-2xl p-8 mb-8">
              <p className="text-muted-foreground leading-relaxed text-lg">
                Soy desarrollador backend especializado en la creación de soluciones{" "}
                <span className="text-primary font-semibold">eficientes y escalables</span>. Tengo experiencia en{" "}
                <span className="text-accent font-semibold">pruebas, optimización de rendimiento</span> y desarrollo
                ágil (SCRUM). Me enfoco en construir funcionalidades orientadas a la{" "}
                <span className="text-primary font-semibold">gestión de proyectos</span>, con código limpio y
                mantenible. Busco aportar valor en un equipo innovador donde pueda seguir{" "}
                <span className="text-accent font-semibold">creciendo profesionalmente</span>.
              </p>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-4">
              {metrics.map(({ icon: Icon, label, value }, i) => (
                <div
                  key={label}
                  className="glass-card-hover rounded-xl p-5"
                  style={{ transitionDelay: `${0.25 + i * 0.05}s` }}
                >
                  <Icon size={20} className="text-accent mb-2" />
                  <div className="text-3xl font-black gradient-text">{value}</div>
                  <div className="text-xs text-muted-foreground mt-1">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
