import { useEffect, useRef, useState } from "react";
import { GraduationCap, Calendar, ChevronDown, FileText } from "lucide-react";
import { useFormations, type PublicFormation } from "@/hooks/usePublicData";
import { Skeleton } from "@/components/ui/skeleton";
import CertificateModal from "./CertificateModal";

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

const statusColor: Record<PublicFormation["status"], string> = {
  Completado: "hsl(142 70% 45%)",
  "En progreso": "hsl(45 100% 55%)",
  Certificado: "hsl(217 91% 60%)",
};

export default function Education() {
  const sectionRef = useRef<HTMLElement>(null);
  const { data, loading } = useFormations();
  useScrollAnimation(sectionRef, [loading, data.length]);
  const [openId, setOpenId] = useState<string | null>(null);
  const [cert, setCert] = useState<{ url: string; mime: string | null; title: string } | null>(null);

  return (
    <section
      id="education"
      ref={sectionRef}
      className="py-16 sm:py-20 lg:py-28 px-4 sm:px-6 lg:px-8 section-divider"
    >
      <div className="max-w-5xl mx-auto">
        <div className="animate-in-view flex items-center gap-3 mb-4">
          <span className="w-8 h-px gradient-bg" />
          <span className="text-accent text-sm font-mono font-bold tracking-widest uppercase">Formación</span>
        </div>

        <h2
          className="animate-in-view text-3xl sm:text-4xl lg:text-5xl font-black mb-10 sm:mb-16"
          style={{ transitionDelay: "0.1s" }}
        >
          Base <span className="gradient-text">Académica</span>
        </h2>

        {loading ? (
          <div className="space-y-5">
            <Skeleton className="h-28 rounded-2xl" />
            <Skeleton className="h-28 rounded-2xl" />
            <Skeleton className="h-28 rounded-2xl" />
          </div>
        ) : data.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="flex flex-col gap-5">
            {data.map((f, i) => {
              const open = openId === f.id;
              const color = statusColor[f.status];
              return (
                <div
                  key={f.id}
                  className="animate-in-view glass-card-hover rounded-2xl overflow-hidden"
                  style={{ transitionDelay: `${0.1 + i * 0.06}s` }}
                >
                  <button
                    type="button"
                    onClick={() => setOpenId(open ? null : f.id)}
                    className="w-full text-left p-6 sm:p-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 rounded-2xl"
                  >
                    <div className="flex items-start gap-4 sm:gap-5">
                      <div
                        className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0 overflow-hidden"
                        style={{ background: `${color}15`, border: `1px solid ${color}30` }}
                      >
                        {f.icon_image_url ? (
                          <img src={f.icon_image_url} alt="" loading="lazy" className="w-full h-full object-cover" />
                        ) : (
                          f.icon_emoji || "🎓"
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <h3 className="text-base sm:text-lg font-black text-foreground">{f.course}</h3>
                            <p className="font-semibold mt-1" style={{ color }}>
                              {f.institution}
                            </p>
                            {(f.city || f.country) && (
                              <p className="text-muted-foreground text-sm">
                                {[f.city, f.country].filter(Boolean).join(", ")}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            {f.obtained_date && (
                              <div className="hidden sm:flex items-center gap-1.5 text-muted-foreground text-sm font-mono">
                                <Calendar size={13} className="text-accent" />
                                {f.obtained_date}
                              </div>
                            )}
                            <ChevronDown
                              size={20}
                              className="text-muted-foreground transition-transform duration-300"
                              style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
                            />
                          </div>
                        </div>

                        <div className="flex items-center flex-wrap gap-2 mt-3">
                          <span
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold"
                            style={{ background: `${color}15`, color, border: `1px solid ${color}30` }}
                          >
                            <GraduationCap size={13} />
                            {f.status}
                          </span>
                          {f.obtained_date && (
                            <span className="sm:hidden text-xs text-muted-foreground font-mono">{f.obtained_date}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>

                  {f.certificate_url && (
                    <div
                      className="overflow-hidden transition-all duration-300 ease-in-out"
                      style={{
                        maxHeight: open ? "120px" : "0px",
                        opacity: open ? 1 : 0,
                      }}
                    >
                      <div className="px-6 sm:px-8 pb-6 pt-0">
                        <div className="border-t border-border/50 pt-4">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setCert({
                                url: f.certificate_url!,
                                mime: f.certificate_mime,
                                title: f.course,
                              });
                            }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm bg-accent/10 text-accent border border-accent/30 hover:bg-accent/20 transition-colors"
                          >
                            <FileText size={14} />
                            Ver certificado
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <CertificateModal
        url={cert?.url ?? null}
        mime={cert?.mime ?? null}
        title={cert?.title}
        onClose={() => setCert(null)}
      />
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
        <GraduationCap size={28} className="text-accent" />
      </div>
      <h3 className="text-xl sm:text-2xl font-black mb-2">Formación en construcción</h3>
      <p className="text-muted-foreground max-w-md mx-auto">
        Próximamente: cursos, certificaciones y la base académica que sostiene cada decisión técnica.
      </p>
    </div>
  );
}
