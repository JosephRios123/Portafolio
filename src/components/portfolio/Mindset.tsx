import { useEffect, useRef } from "react";
import { Users, Package, Zap, Heart } from "lucide-react";

const experiences = [
  {
    icon: Users,
    title: "Logístico en Eventos",
    location: "Medellín",
    period: "2021 – 2022",
    description: "Gestión operativa en eventos masivos bajo alta presión. Trabajo con personas, resolución rápida de problemas y liderazgo situacional en entornos dinámicos.",
    traits: ["Trabajo bajo presión", "Atención al cliente", "Extroversión", "Trabajo en equipo"],
    color: "hsl(217 91% 60%)",
    emoji: "🎪",
  },
  {
    icon: Package,
    title: "Auxiliar de Bodega",
    location: "Bona",
    period: "Nov 2024 – Ene 2025",
    description: "Operaciones logísticas en entorno de alta demanda. Disciplina en procesos, organización sistemática y manejo eficiente del tiempo.",
    traits: ["Disciplina", "Organización", "Adaptabilidad", "Gestión del tiempo"],
    color: "hsl(187 92% 42%)",
    emoji: "📦",
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

export default function Mindset() {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollAnimation(sectionRef);

  return (
    <section id="mindset" ref={sectionRef} className="py-20 sm:py-28 px-4 sm:px-6 section-divider" style={{
      background: "radial-gradient(ellipse 60% 40% at 30% 50%, hsl(187 92% 42% / 0.05) 0%, transparent 60%)"
    }}>
      <div className="max-w-7xl mx-auto">
        <div className="animate-in-view flex items-center gap-3 mb-4">
          <span className="w-8 h-px gradient-bg" />
          <span className="text-accent text-sm font-mono font-bold tracking-widest uppercase">Mentalidad</span>
        </div>

        <div className="animate-in-view flex items-center gap-3 mb-4" style={{ transitionDelay: "0.05s" }}>
          <Heart size={20} className="text-accent" />
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black" style={{ transitionDelay: "0.1s" }}>
            Más que código: la <span className="gradient-text">mentalidad</span> que me forjó
          </h2>
        </div>

        <p className="animate-in-view text-muted-foreground text-lg mb-16 max-w-2xl" style={{ transitionDelay: "0.15s" }}>
          Las experiencias más formadoras no siempre vienen de una pantalla. Estas vivencias construyeron al profesional que soy hoy.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {experiences.map(({ icon: Icon, title, location, period, description, traits, color, emoji }, i) => (
            <div
              key={title}
              className="animate-in-view glass-card-hover rounded-2xl p-8"
              style={{ transitionDelay: `${0.1 + i * 0.1}s` }}
            >
              <div className="flex items-start gap-5 mb-6">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shrink-0"
                  style={{ background: `${color}15`, border: `1px solid ${color}30` }}
                >
                  {emoji}
                </div>
                <div>
                  <h3 className="text-xl font-black text-foreground">{title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {location} · <span className="font-mono">{period}</span>
                  </p>
                </div>
              </div>

              <p className="text-muted-foreground leading-relaxed mb-6">{description}</p>

              <div className="flex flex-wrap gap-2">
                {traits.map((trait) => (
                  <span
                    key={trait}
                    className="px-3 py-1 rounded-full text-xs font-bold"
                    style={{ background: `${color}15`, color, border: `1px solid ${color}30` }}
                  >
                    {trait}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Quote */}
        <div className="animate-in-view mt-12 glass-card rounded-2xl p-8 text-center" style={{ transitionDelay: "0.3s" }}>
          <Zap size={24} className="text-accent mx-auto mb-4" />
          <p className="text-xl font-bold text-foreground italic max-w-2xl mx-auto">
            "La resiliencia no se enseña en un aula. Se construye en el campo de batalla de la vida real."
          </p>
        </div>
      </div>
    </section>
  );
}
