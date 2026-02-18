import { useEffect, useRef } from "react";

const technologies = [
  { name: "PHP", sub: "Laravel", emoji: "🐘", color: "hsl(271 60% 60%)" },
  { name: "C#", sub: ".NET Core", emoji: "🔷", color: "hsl(262 83% 65%)" },
  { name: "Python", sub: "Scripting", emoji: "🐍", color: "hsl(45 100% 55%)" },
  { name: "Java", sub: "OOP", emoji: "☕", color: "hsl(27 100% 55%)" },
  { name: "MySQL", sub: "Databases", emoji: "🗄️", color: "hsl(197 71% 53%)" },
  { name: "HTML", sub: "Markup", emoji: "🌐", color: "hsl(21 100% 55%)" },
  { name: "CSS", sub: "Styling", emoji: "🎨", color: "hsl(217 91% 60%)" },
  { name: "JavaScript", sub: "ES6+", emoji: "⚡", color: "hsl(48 100% 55%)" },
  { name: "React", sub: "Frontend", emoji: "⚛️", color: "hsl(187 92% 55%)" },
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

export default function TechStack() {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollAnimation(sectionRef);

  return (
    <section id="stack" ref={sectionRef} className="py-28 px-6 section-divider" style={{
      background: "radial-gradient(ellipse 80% 50% at 50% 50%, hsl(217 91% 60% / 0.05) 0%, transparent 70%)"
    }}>
      <div className="max-w-7xl mx-auto">
        <div className="animate-in-view flex items-center gap-3 mb-4">
          <span className="w-8 h-px gradient-bg" />
          <span className="text-accent text-sm font-mono font-bold tracking-widest uppercase">Tecnologías</span>
        </div>

        <h2 className="animate-in-view text-4xl sm:text-5xl font-black mb-4" style={{ transitionDelay: "0.1s" }}>
          Mi <span className="gradient-text">Arsenal</span> Tecnológico
        </h2>
        <p className="animate-in-view text-muted-foreground text-lg mb-16 max-w-xl" style={{ transitionDelay: "0.15s" }}>
          Herramientas con las que construyo soluciones robustas día a día.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {technologies.map(({ name, sub, emoji, color }, i) => (
            <div
              key={name}
              className="animate-in-view glass-card-hover tech-card-glow rounded-2xl p-6 flex flex-col items-center text-center cursor-default group"
              style={{ transitionDelay: `${0.05 * i}s` }}
            >
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl mb-4 transition-transform duration-300 group-hover:scale-110"
                style={{ background: `${color}15`, border: `1px solid ${color}30` }}
              >
                {emoji}
              </div>
              <div className="font-black text-foreground text-lg leading-none">{name}</div>
              <div className="text-xs text-muted-foreground mt-1 font-mono">{sub}</div>
              {/* Glow bar */}
              <div
                className="mt-4 w-8 h-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:w-full"
                style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
