import { useEffect, useRef, useState } from "react";
import {
  Activity,
  Atom,
  Briefcase,
  Braces,
  Building2,
  Cloud,
  Code2,
  Cpu,
  Database,
  DatabaseZap,
  Infinity,
  PanelsTopLeft,
  ServerCog,
  Terminal,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const metrics = [
  { icon: Briefcase, label: "Años de experiencia", value: "2+" },
  { icon: Code2, label: "Tecnologías dominadas", value: "9+" },
  { icon: Building2, label: "Empresas", value: "2" },
  { icon: Infinity, label: "Afición", value: "☕" },
];

type Technology = {
  name: string;
  level: string;
  description: string;
  Icon: LucideIcon;
};

const technologies: Technology[] = [
  { name: "React", level: "Avanzado", description: "Interfaces modulares y experiencias de alto rendimiento.", Icon: Atom },
  { name: "TypeScript", level: "Avanzado", description: "Contratos sólidos y código seguro a escala.", Icon: Braces },
  { name: "JavaScript", level: "Avanzado", description: "Lógica moderna para productos web mantenibles.", Icon: Code2 },
  { name: "Node.js", level: "Intermedio", description: "Servicios asíncronos y herramientas del lado servidor.", Icon: Cpu },
  { name: "Supabase", level: "Avanzado", description: "Datos, autenticación y almacenamiento integrados.", Icon: DatabaseZap },
  { name: "Cloud", level: "Intermedio", description: "Despliegue y operación de soluciones escalables.", Icon: Cloud },
  { name: "Database", level: "Avanzado", description: "Modelado relacional, consultas y optimización.", Icon: Database },
  { name: "Backend", level: "Avanzado", description: "APIs robustas, reglas de negocio y arquitectura limpia.", Icon: ServerCog },
  { name: "UI/UX", level: "Intermedio", description: "Interfaces claras con foco en accesibilidad y uso.", Icon: PanelsTopLeft },
  { name: "Terminal", level: "Avanzado", description: "Automatización, diagnóstico y flujos de desarrollo.", Icon: Terminal },
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
  const [activeTechnology, setActiveTechnology] = useState(technologies[0]);
  useScrollAnimation(sectionRef);

  return (
    <section id="about" ref={sectionRef} className="chapter-section section-divider px-4 py-20 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="animate-in-view flex items-center gap-3 mb-4">
          <span className="w-8 h-px gradient-bg" />
          <span className="font-mono text-sm font-bold uppercase text-accent">system.profile_info</span>
        </div>

        <h2 className="animate-in-view mb-8 text-3xl font-black leading-tight sm:text-4xl md:text-5xl" style={{ transitionDelay: "0.1s" }}>
          Arquitectura + <span className="gradient-text">Código</span>
        </h2>

        <div className="grid gap-5 lg:grid-cols-12 lg:items-stretch">
          <div className="animate-in-view order-2 min-w-0 lg:order-1 lg:col-span-5" style={{ transitionDelay: "0.15s" }}>
            <div className="tech-hub" aria-label="Mapa orbital de tecnologías">
              <div className="tech-hub__ambient" aria-hidden="true" />
              <svg className="tech-hub__geometry" viewBox="0 0 100 100" aria-hidden="true">
                <circle cx="50" cy="50" r="39" className="tech-hub__ring" />
                <circle cx="50" cy="50" r="27" className="tech-hub__ring tech-hub__ring--inner" />
                {technologies.map((_, index) => {
                  const angle = (index * 360) / technologies.length - 90;
                const rad = (angle * Math.PI) / 180;
                  return <line key={index} x1="50" y1="50" x2={50 + Math.cos(rad) * 39} y2={50 + Math.sin(rad) * 39} className="tech-hub__line" />;
                })}
              </svg>

              <div className="tech-hub__core">
                <div className="tech-hub__core-icon"><Cpu aria-hidden="true" /></div>
                <strong>BACKEND</strong>
                <span><Activity aria-hidden="true" /> CORE_ACTIVE</span>
              </div>

              {technologies.map((tech, index) => {
                const angle = (index * 360) / technologies.length - 90;
                const rad = (angle * Math.PI) / 180;
                const Icon = tech.Icon;
                const isActive = activeTechnology.name === tech.name;
                return (
                  <div key={tech.name} className="tech-hub__node-position" style={{ left: `${50 + Math.cos(rad) * 39}%`, top: `${50 + Math.sin(rad) * 39}%` }}>
                    <button
                      type="button"
                      className="tech-hub__node"
                      aria-label={`${tech.name}, dominio ${tech.level}`}
                      aria-pressed={isActive}
                      onFocus={() => setActiveTechnology(tech)}
                      onMouseEnter={() => setActiveTechnology(tech)}
                      onClick={() => setActiveTechnology(tech)}
                    >
                      <Icon aria-hidden="true" />
                      <span className="tech-hub__tooltip" role="tooltip">
                        <strong>{tech.name}</strong>
                        <small>{tech.level}</small>
                        <span>{tech.description}</span>
                      </span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="animate-in-view order-1 flex min-w-0 flex-col gap-5 lg:order-2 lg:col-span-7" style={{ transitionDelay: "0.2s" }}>
            <div className="about-bento-panel p-6 sm:p-8">
              <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
                Soy desarrollador backend especializado en la creación de soluciones{" "}
                <span className="text-primary font-semibold">eficientes y escalables</span>. Tengo experiencia en{" "}
                <span className="text-accent font-semibold">pruebas, optimización de rendimiento</span> y desarrollo
                ágil (SCRUM). Me enfoco en construir funcionalidades orientadas a la{" "}
                <span className="text-primary font-semibold">gestión de proyectos</span>, con código limpio y
                mantenible. Busco aportar valor en un equipo innovador donde pueda seguir{" "}
                <span className="text-accent font-semibold">creciendo profesionalmente</span>.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {metrics.map(({ icon: Icon, label, value }, i) => (
                <div
                  key={label}
                  className="about-bento-panel p-4 sm:p-5"
                  style={{ transitionDelay: `${0.25 + i * 0.05}s` }}
                >
                  <Icon size={18} className="mb-2 text-accent" />
                  <div className="gradient-text text-2xl font-black sm:text-3xl">{value}</div>
                  <div className="text-xs text-muted-foreground mt-1">{label}</div>
                </div>
              ))}
            </div>

            <div className="about-bento-panel flex min-h-32 items-start gap-4 p-5" aria-live="polite">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-md border border-accent/30 bg-accent/10 text-accent">
                <activeTechnology.Icon aria-hidden="true" size={21} />
              </div>
              <div className="min-w-0">
                <div className="mb-1 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <h3 className="font-mono text-base font-bold text-foreground">{activeTechnology.name}</h3>
                  <span className="font-mono text-[11px] uppercase text-accent">{activeTechnology.level}</span>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">{activeTechnology.description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
