import { useEffect, useRef } from "react";
import { CheckCircle2, Calendar, Building2, Briefcase } from "lucide-react";
import { useExperiences } from "@/hooks/usePublicData";
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

export default function Experience() {
  const sectionRef = useRef<HTMLElement>(null);
  const { data, loading } = useExperiences();
  useScrollAnimation(sectionRef, [loading, data.length]);

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="py-16 sm:py-20 lg:py-28 px-4 sm:px-6 lg:px-8 section-divider"
    >
      <div className="max-w-5xl mx-auto">
        <div className="animate-in-view flex items-center gap-3 mb-4">
          <span className="w-8 h-px gradient-bg" />
          <span className="text-accent text-sm font-mono font-bold tracking-widest uppercase">Experiencia</span>
        </div>

        <h2
          className="animate-in-view text-3xl sm:text-4xl lg:text-5xl font-black mb-10 sm:mb-16"
          style={{ transitionDelay: "0.1s" }}
        >
          Trayectoria <span className="gradient-text">Profesional</span>
        </h2>

        {loading ? (
          <div className="space-y-6">
            <Skeleton className="h-40 rounded-2xl" />
            <Skeleton className="h-40 rounded-2xl" />
          </div>
        ) : data.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-accent to-transparent hidden sm:block" />
            <div className="flex flex-col gap-12">
              {data.map(({ id, role, company, start_date, end_date, is_current, color, bullets }, i) => (
                <div
                  key={id}
                  className="animate-in-view sm:pl-20 relative"
                  style={{ transitionDelay: `${0.1 * i}s` }}
                >
                  <div
                    className="absolute left-3.5 top-6 w-5 h-5 rounded-full border-2 border-background hidden sm:flex items-center justify-center"
                    style={{ background: color, boxShadow: `0 0 16px ${color}` }}
                  >
                    {is_current && <span className="w-2 h-2 rounded-full bg-background animate-pulse" />}
                  </div>

                  <div className="glass-card-hover rounded-2xl p-6 sm:p-8">
                    <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                      <div>
                        <h3 className="text-lg sm:text-xl font-black text-foreground mb-2">{role}</h3>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Building2 size={14} style={{ color }} />
                          <span className="font-semibold" style={{ color }}>
                            {company}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-start sm:items-end gap-2">
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full glass-card text-xs font-mono text-muted-foreground">
                          <Calendar size={12} />
                          {start_date} — {is_current ? "Actualidad" : end_date}
                        </div>
                      </div>
                    </div>

                    {bullets.length > 0 && (
                      <ul className="grid sm:grid-cols-2 gap-3">
                        {bullets.map((b) => (
                          <li key={b.id} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                            <CheckCircle2 size={15} className="mt-0.5 shrink-0" style={{ color }} />
                            {b.text}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function EmptyState() {
  return (
    <div className="glass-card rounded-2xl p-10 sm:p-14 text-center">
      <div
        className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-5"
        style={{
          background: "linear-gradient(135deg, hsl(217 91% 60% / 0.15), hsl(187 92% 42% / 0.15))",
          border: "1px solid hsl(217 91% 60% / 0.3)",
        }}
      >
        <Briefcase size={28} className="text-accent" />
      </div>
      <h3 className="text-xl sm:text-2xl font-black mb-2">Trayectoria en construcción</h3>
      <p className="text-muted-foreground max-w-md mx-auto">
        Próximamente cada experiencia, cada lección y cada victoria que han forjado al profesional que soy hoy.
      </p>
    </div>
  );
}
