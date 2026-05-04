import { useEffect, useRef } from "react";
import { Rocket, Sparkles, Code2, ArrowRight, ExternalLink } from "lucide-react";
import { useProjects } from "@/hooks/usePublicData";
import { Skeleton } from "@/components/ui/skeleton";

function useScrollAnimation(ref: React.RefObject<HTMLElement>, deps: unknown[] = []) {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("visible")),
      { threshold: 0.1 }
    );
    ref.current?.querySelectorAll(".animate-in-view").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const { data, loading } = useProjects();
  useScrollAnimation(sectionRef, [loading, data.length]);

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="py-16 sm:py-20 lg:py-28 px-4 sm:px-6 lg:px-8 section-divider relative overflow-hidden"
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 50%, hsl(217 91% 60% / 0.06) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(hsl(217 91% 60%) 1px, transparent 1px), linear-gradient(90deg, hsl(217 91% 60%) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="animate-in-view flex items-center gap-3 mb-4">
          <span className="w-8 h-px gradient-bg" />
          <span className="text-accent text-sm font-mono font-bold tracking-widest uppercase">Proyectos</span>
        </div>

        <h2
          className="animate-in-view text-3xl sm:text-4xl lg:text-5xl font-black mb-6"
          style={{ transitionDelay: "0.1s" }}
        >
          Lo que estoy <span className="gradient-text">construyendo</span>
        </h2>

        <p
          className="animate-in-view text-muted-foreground text-base sm:text-lg mb-12 sm:mb-16 max-w-2xl"
          style={{ transitionDelay: "0.15s" }}
        >
          {data.length === 0
            ? "La próxima versión de mi carrera se está desarrollando. Grandes proyectos en camino."
            : "Cada proyecto es una decisión técnica concreta hecha realidad."}
        </p>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-72 rounded-2xl" />
            ))}
          </div>
        ) : data.length === 0 ? (
          <ComingSoon />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {data.map((p, i) => (
              <article
                key={p.id}
                className="animate-in-view glass-card-hover rounded-2xl overflow-hidden flex flex-col group focus-within:ring-2 focus-within:ring-accent/60"
                style={{ transitionDelay: `${0.05 * i}s` }}
              >
                {p.image_url ? (
                  <div className="aspect-[16/10] overflow-hidden bg-muted/30">
                    <img
                      src={p.image_url}
                      alt={p.name}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                  </div>
                ) : (
                  <div className="aspect-[16/10] flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10">
                    <Code2 size={48} className="text-accent/40" />
                  </div>
                )}
                <div className="p-5 sm:p-6 flex-1 flex flex-col">
                  <h3 className="font-black text-lg text-foreground mb-2">{p.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4 leading-relaxed flex-1">
                    {p.description}
                  </p>
                  {p.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {p.tags.map((t) => (
                        <span
                          key={t}
                          className="px-2.5 py-0.5 text-[11px] rounded-full bg-accent/10 text-accent border border-accent/30 font-semibold"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                  {p.link && (
                    <a
                      href={p.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:text-accent transition-colors mt-auto"
                    >
                      Ver proyecto
                      <ExternalLink size={14} className="group-hover:translate-x-0.5 transition-transform" />
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function ComingSoon() {
  return (
    <div className="animate-in-view relative rounded-3xl overflow-hidden" style={{ transitionDelay: "0.2s" }}>
      <div
        className="absolute inset-0 rounded-3xl"
        style={{
          background:
            "linear-gradient(135deg, hsl(217 91% 60% / 0.3), hsl(187 92% 42% / 0.3), hsl(217 91% 60% / 0.3))",
          backgroundSize: "200% 200%",
          animation: "gradient-shift 4s ease infinite",
          padding: "1px",
        }}
      />
      <div className="relative glass-card rounded-3xl p-10 sm:p-16 flex flex-col items-center text-center" style={{ border: "none" }}>
        <div className="absolute top-8 left-8 opacity-10">
          <Code2 size={40} className="text-primary" style={{ animation: "float 5s ease-in-out infinite" }} />
        </div>
        <div className="absolute bottom-8 right-8 opacity-10">
          <Sparkles size={36} className="text-accent" style={{ animation: "float 4s ease-in-out 1s infinite" }} />
        </div>
        <div className="absolute top-12 right-16 opacity-10">
          <ArrowRight size={24} className="text-primary" style={{ animation: "float 6s ease-in-out 2s infinite" }} />
        </div>
        <div
          className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl flex items-center justify-center mb-8"
          style={{
            background: "linear-gradient(135deg, hsl(217 91% 60% / 0.15), hsl(187 92% 42% / 0.15))",
            border: "1px solid hsl(217 91% 60% / 0.3)",
            boxShadow: "0 0 40px hsl(217 91% 60% / 0.15), 0 0 80px hsl(187 92% 42% / 0.08)",
            animation: "pulse-glow 3s ease-in-out infinite",
          }}
        >
          <Rocket size={36} className="text-primary" />
        </div>
        <h3 className="text-2xl sm:text-4xl font-black text-foreground mb-4">
          Próximamente<span className="gradient-text">...</span>
        </h3>
        <p className="text-muted-foreground text-base sm:text-lg max-w-lg mb-2 leading-relaxed">
          Estoy construyendo soluciones que pronto estarán aquí. Cada línea de código me acerca más a proyectos que{" "}
          <span className="text-accent font-semibold">marcarán la diferencia</span>.
        </p>
      </div>
    </div>
  );
}
