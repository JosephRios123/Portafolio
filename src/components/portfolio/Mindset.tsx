import { useEffect, useRef } from "react";
import { Heart, Zap, Sparkles } from "lucide-react";
import { useMindset, type PublicPrinciple } from "@/hooks/usePublicData";
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

const catColor: Record<PublicPrinciple["category"], string> = {
  "Técnica": "hsl(217 91% 60%)",
  "Humana": "hsl(187 92% 42%)",
  "Estratégica": "hsl(280 80% 60%)",
};

export default function Mindset() {
  const sectionRef = useRef<HTMLElement>(null);
  const { data, loading } = useMindset();
  useScrollAnimation(sectionRef, [loading, data.length]);

  return (
    <section
      id="mindset"
      ref={sectionRef}
      className="chapter-section py-16 sm:py-20 lg:py-28 px-4 sm:px-6 lg:px-8 section-divider"
      style={{
        background:
          "radial-gradient(ellipse 60% 40% at 30% 50%, hsl(187 92% 42% / 0.05) 0%, transparent 60%)",
      }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="animate-in-view flex items-center gap-3 mb-4">
          <span className="w-8 h-px gradient-bg" />
          <span className="text-accent text-sm font-mono font-bold tracking-widest uppercase">Mentalidad</span>
        </div>

        <div className="animate-in-view flex items-center gap-3 mb-4" style={{ transitionDelay: "0.05s" }}>
          <Heart size={20} className="text-accent" />
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black">
            Más que código: la <span className="gradient-text">mentalidad</span> que me forjó
          </h2>
        </div>

        <p
          className="animate-in-view text-muted-foreground text-base sm:text-lg mb-12 sm:mb-16 max-w-2xl"
          style={{ transitionDelay: "0.15s" }}
        >
          Las experiencias más formadoras no siempre vienen de una pantalla. Estos principios construyeron al profesional que soy hoy.
        </p>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-56 rounded-2xl" />
            ))}
          </div>
        ) : data.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {data.map((p, i) => {
              const color = catColor[p.category];
              return (
                <div
                  key={p.id}
                  className="animate-in-view glass-card-hover rounded-2xl p-6 sm:p-7"
                  style={{ transitionDelay: `${0.05 * i}s` }}
                >
                  <div className="flex items-start gap-4 mb-5">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0 overflow-hidden"
                      style={{ background: `${color}15`, border: `1px solid ${color}30` }}
                    >
                      {p.icon_image_url ? (
                        <img src={p.icon_image_url} alt="" loading="lazy" className="w-full h-full object-cover" />
                      ) : (
                        p.icon_emoji || "💡"
                      )}
                    </div>
                    <div className="min-w-0">
                      <span
                        className="inline-block px-2 py-0.5 text-[11px] rounded-full font-bold mb-1.5"
                        style={{ background: `${color}15`, color, border: `1px solid ${color}30` }}
                      >
                        {p.category}
                      </span>
                      <h3 className="text-base sm:text-lg font-black text-foreground leading-tight">{p.phrase}</h3>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{p.description}</p>
                </div>
              );
            })}
          </div>
        )}

        <div
          className="animate-in-view mt-12 glass-card rounded-2xl p-6 sm:p-8 text-center"
          style={{ transitionDelay: "0.3s" }}
        >
          <Zap size={24} className="text-accent mx-auto mb-4" />
          <p className="text-lg sm:text-xl font-bold text-foreground italic max-w-2xl mx-auto">
            "La resiliencia no se enseña en un aula. Se construye en el campo de batalla de la vida real."
          </p>
        </div>
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
          background: "linear-gradient(135deg, hsl(187 92% 42% / 0.15), hsl(217 91% 60% / 0.15))",
          border: "1px solid hsl(187 92% 42% / 0.3)",
        }}
      >
        <Sparkles size={28} className="text-accent" />
      </div>
      <h3 className="text-xl sm:text-2xl font-black mb-2">Principios en construcción</h3>
      <p className="text-muted-foreground max-w-md mx-auto">
        Próximamente compartiré los principios que guían cada decisión técnica y humana de mi trayectoria.
      </p>
    </div>
  );
}
