import { useEffect, useMemo, useRef, useState } from "react";
import { Briefcase, Building2, Code2, Infinity as InfinityIcon } from "lucide-react";
import { useProfileCore, useProfileTechnologies, type OrbitalTechnology } from "@/hooks/usePublicData";
import { getTechIcon } from "@/lib/techIcons";
import OrbitalSystem from "./orbital/OrbitalSystem";
import { Skeleton } from "@/components/ui/skeleton";

function useScrollAnimation(ref: React.RefObject<HTMLElement>) {
  useEffect(() => {
    const section = ref.current;
    if (!section) return;
    const animatedElements = section.querySelectorAll(".animate-in-view");
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          animatedElements.forEach((element) => element.classList.add("visible"));
          observer.disconnect();
        }
      },
      { root: section.closest(".chapter-track"), threshold: 0.15 }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, [ref]);
}

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const { data: technologies, loading } = useProfileTechnologies();
  const { core } = useProfileCore();
  const [activeId, setActiveId] = useState<string | null>(null);
  useScrollAnimation(sectionRef);

  const active: OrbitalTechnology | null = useMemo(
    () => technologies.find((t) => t.id === activeId) ?? technologies[0] ?? null,
    [technologies, activeId]
  );

  const metrics = [
    { icon: Briefcase, label: "Años de experiencia", value: "2+" },
    { icon: Code2, label: "Tecnologías dominadas", value: `${technologies.length || 0}+` },
    { icon: Building2, label: "Empresas", value: "2" },
    { icon: InfinityIcon, label: "Afición", value: "☕" },
  ];

  const ActiveIcon = getTechIcon(active?.icon_name);

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
            {loading ? (
              <Skeleton className="mx-auto aspect-square w-full max-w-[31rem] rounded-full" />
            ) : technologies.length === 0 ? (
              <div className="glass-card mx-auto flex aspect-square w-full max-w-[31rem] items-center justify-center rounded-2xl p-8 text-center text-sm text-muted-foreground">
                Aún no hay tecnologías configuradas.
              </div>
            ) : (
              <OrbitalSystem
                technologies={technologies}
                core={core}
                activeId={active?.id ?? null}
                onActivate={(t) => setActiveId(t.id)}
              />
            )}
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

            {active && (
              <div className="about-bento-panel flex min-h-32 items-start gap-4 p-5" aria-live="polite">
                <div
                  className="flex size-11 shrink-0 items-center justify-center rounded-md border border-accent/30 bg-accent/10 text-accent"
                  style={active.color ? { borderColor: `${active.color}55`, color: active.color, background: `${active.color}14` } : undefined}
                >
                  <ActiveIcon aria-hidden="true" size={21} />
                </div>
                <div className="min-w-0">
                  <div className="mb-1 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <h3 className="font-mono text-base font-bold text-foreground">{active.name}</h3>
                    <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                      {active.category}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">{active.description}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
