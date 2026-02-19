import { useEffect, useRef } from "react";
import { Briefcase, Code2, Building2, Infinity } from "lucide-react";

const metrics = [
  { icon: Briefcase, label: "Años de experiencia", value: "2+" },
  { icon: Code2, label: "Tecnologías dominadas", value: "9+" },
  { icon: Building2, label: "Empresas", value: "2" },
  { icon: Infinity, label: "Afición", value: "☕" },
];

const technologies = [
  { name: "PHP", sub: "Laravel", emoji: "🐘", color: "hsl(271 60% 60%)" },
  { name: "C#", sub: ".NET", emoji: "🔷", color: "hsl(262 83% 65%)" },
  { name: "Python", sub: "Scripting", emoji: "🐍", color: "hsl(45 100% 55%)" },
  { name: "Java", sub: "OOP", emoji: "☕", color: "hsl(27 100% 55%)" },
  { name: "MySQL", sub: "DB", emoji: "🗄️", color: "hsl(197 71% 53%)" },
  { name: "HTML", sub: "Markup", emoji: "🌐", color: "hsl(21 100% 55%)" },
  { name: "CSS", sub: "Styling", emoji: "🎨", color: "hsl(217 91% 60%)" },
  { name: "JS", sub: "ES6+", emoji: "⚡", color: "hsl(48 100% 55%)" },
  { name: "React", sub: "Frontend", emoji: "⚛️", color: "hsl(187 92% 55%)" },
  { name: "ASP.NET", sub: "Backend", emoji: "🔷", color: "hsl(262 83% 65%)" },
];

function useScrollAnimation(ref: React.RefObject<HTMLElement>) {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("visible");
      }),
      { threshold: 0.15 }
    );
    ref.current?.querySelectorAll(".animate-in-view").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [ref]);
}

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollAnimation(sectionRef);

  return (
    <section id="about" ref={sectionRef} className="py-28 px-6 section-divider">
      <div className="max-w-7xl mx-auto">
        <div className="animate-in-view flex items-center gap-3 mb-4">
          <span className="w-8 h-px gradient-bg" />
          <span className="text-accent text-sm font-mono font-bold tracking-widest uppercase">Sobre Mí</span>
        </div>

        <h2 className="animate-in-view text-4xl sm:text-5xl font-black mb-16 leading-tight" style={{ transitionDelay: "0.1s" }}>
          Estrategia + <span className="gradient-text">Código</span>
        </h2>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Orbital tech system */}
          <div className="animate-in-view order-2 lg:order-1 flex justify-center" style={{ transitionDelay: "0.15s" }}>
            <div className="relative" style={{ width: "340px", height: "340px" }}>
              {/* Orbit rings */}
              <div
                className="absolute rounded-full"
                style={{
                  inset: "-10px",
                  border: "1px solid hsl(217 91% 60% / 0.1)",
                  animation: "spin 30s linear infinite",
                }}
              />
              <div
                className="absolute rounded-full"
                style={{
                  inset: "-40px",
                  border: "1px dashed hsl(187 92% 42% / 0.08)",
                  animation: "spin 45s linear infinite reverse",
                }}
              />

              {/* Central circle */}
              <div className="absolute inset-0 flex items-center justify-center">
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
                  className="relative w-32 h-32 rounded-full flex items-center justify-center glass-card z-10"
                  style={{ border: "none" }}
                >
                  <div
                    className="w-28 h-28 rounded-full flex items-center justify-center"
                    style={{
                      background: "radial-gradient(circle at 35% 35%, hsl(217 91% 60% / 0.2), hsl(187 92% 42% / 0.1))",
                      boxShadow: "inset 0 0 40px hsl(217 91% 60% / 0.1)",
                    }}
                  >
                    <div className="text-center">
                      <div className="text-4xl mb-1">👨‍💻</div>
                      <div className="text-[9px] font-mono text-accent/70">&lt;dev /&gt;</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Orbiting tech icons */}
              {technologies.map((tech, i) => {
                const angle = (i * 360) / technologies.length;
                const radius = 150;
                const rad = (angle * Math.PI) / 180;
                const x = Math.cos(rad) * radius;
                const y = Math.sin(rad) * radius;

                return (
                  <div
                    key={tech.name}
                    className="absolute group cursor-default"
                    style={{
                      left: `calc(50% + ${x}px - 22px)`,
                      top: `calc(50% + ${y}px - 22px)`,
                      animation: `float ${3 + (i % 3) * 0.5}s ease-in-out ${i * 0.2}s infinite`,
                    }}
                  >
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center text-lg transition-all duration-300 group-hover:scale-125"
                      style={{
                        background: `${tech.color}38`,
                        border: `1px solid ${tech.color}30`,
                        boxShadow: `0 0 0px ${tech.color}00`,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = `0 0 20px ${tech.color}40`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = `0 0 0px ${tech.color}00`;
                      }}
                    >
                      {tech.emoji}
                    </div>
                    {/* Tooltip */}
                    <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                      <span className="text-[10px] font-bold text-foreground bg-background/90 px-2 py-0.5 rounded-md border border-border">
                        {tech.name}
                      </span>
                    </div>
                  </div>
                );
              })}

              {/* Connection lines (decorative) */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-10" viewBox="0 0 340 340">
                {technologies.map((_, i) => {
                  const angle = (i * 360) / technologies.length;
                  const rad = (angle * Math.PI) / 180;
                  const x = 170 + Math.cos(rad) * 150;
                  const y = 170 + Math.sin(rad) * 150;
                  return (
                    <line
                      key={i}
                      x1="170" y1="170"
                      x2={x} y2={y}
                      stroke="hsl(217 91% 60%)"
                      strokeWidth="0.5"
                      strokeDasharray="4 4"
                    />
                  );
                })}
              </svg>
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
