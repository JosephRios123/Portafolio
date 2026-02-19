import { useEffect, useRef } from "react";
import { Rocket, Sparkles, Code2, ArrowRight } from "lucide-react";

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

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollAnimation(sectionRef);

  return (
    <section id="projects" ref={sectionRef} className="py-28 px-6 section-divider relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse 60% 50% at 50% 50%, hsl(217 91% 60% / 0.06) 0%, transparent 70%)"
      }} />
      
      {/* Animated grid pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{
        backgroundImage: "linear-gradient(hsl(217 91% 60%) 1px, transparent 1px), linear-gradient(90deg, hsl(217 91% 60%) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
      }} />

      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="animate-in-view flex items-center gap-3 mb-4">
          <span className="w-8 h-px gradient-bg" />
          <span className="text-accent text-sm font-mono font-bold tracking-widest uppercase">Proyectos</span>
        </div>

        <h2 className="animate-in-view text-4xl sm:text-5xl font-black mb-6" style={{ transitionDelay: "0.1s" }}>
          Lo que estoy <span className="gradient-text">construyendo</span>
        </h2>

        <p className="animate-in-view text-muted-foreground text-lg mb-16 max-w-2xl" style={{ transitionDelay: "0.15s" }}>
          La próxima versión de mi carrera se está desarrollando. Grandes proyectos en camino.
        </p>

        {/* Coming soon card */}
        <div
          className="animate-in-view relative rounded-3xl overflow-hidden"
          style={{ transitionDelay: "0.2s" }}
        >
          {/* Outer glow border */}
          <div className="absolute inset-0 rounded-3xl" style={{
            background: "linear-gradient(135deg, hsl(217 91% 60% / 0.3), hsl(187 92% 42% / 0.3), hsl(217 91% 60% / 0.3))",
            backgroundSize: "200% 200%",
            animation: "gradient-shift 4s ease infinite",
            padding: "1px",
          }} />

          <div className="relative glass-card rounded-3xl p-12 sm:p-16 flex flex-col items-center text-center" style={{ border: "none" }}>
            {/* Floating decorative elements */}
            <div className="absolute top-8 left-8 opacity-10">
              <Code2 size={40} className="text-primary" style={{ animation: "float 5s ease-in-out infinite" }} />
            </div>
            <div className="absolute bottom-8 right-8 opacity-10">
              <Sparkles size={36} className="text-accent" style={{ animation: "float 4s ease-in-out 1s infinite" }} />
            </div>
            <div className="absolute top-12 right-16 opacity-10">
              <ArrowRight size={24} className="text-primary" style={{ animation: "float 6s ease-in-out 2s infinite" }} />
            </div>

            {/* Rocket icon with glow */}
            <div
              className="w-24 h-24 rounded-3xl flex items-center justify-center mb-8"
              style={{
                background: "linear-gradient(135deg, hsl(217 91% 60% / 0.15), hsl(187 92% 42% / 0.15))",
                border: "1px solid hsl(217 91% 60% / 0.3)",
                boxShadow: "0 0 40px hsl(217 91% 60% / 0.15), 0 0 80px hsl(187 92% 42% / 0.08)",
                animation: "pulse-glow 3s ease-in-out infinite",
              }}
            >
              <Rocket size={40} className="text-primary" />
            </div>

            <h3 className="text-3xl sm:text-4xl font-black text-foreground mb-4">
              Próximamente<span className="gradient-text">...</span>
            </h3>

            <p className="text-muted-foreground text-lg max-w-lg mb-8 leading-relaxed">
              Estoy construyendo soluciones que pronto estarán aquí. Cada línea de código me acerca más a proyectos que 
              <span className="text-accent font-semibold"> marcarán la diferencia</span>.
            </p>

            {/* Status pills */}
            <div className="flex flex-wrap justify-center gap-3 mb-10">
              {["Diseñando", "Desarrollando", "Innovando"].map((text, i) => (
                <span
                  key={text}
                  className="px-4 py-2 rounded-full text-sm font-bold"
                  style={{
                    background: i % 2 === 0 ? "hsl(217 91% 60% / 0.1)" : "hsl(187 92% 42% / 0.1)",
                    color: i % 2 === 0 ? "hsl(217 91% 60%)" : "hsl(187 92% 42%)",
                    border: `1px solid ${i % 2 === 0 ? "hsl(217 91% 60% / 0.3)" : "hsl(187 92% 42% / 0.3)"}`,
                    animation: `float ${3 + i * 0.5}s ease-in-out ${i * 0.3}s infinite`,
                  }}
                >
                  <span className="inline-block w-1.5 h-1.5 rounded-full mr-2 animate-pulse" style={{
                    background: i % 2 === 0 ? "hsl(217 91% 60%)" : "hsl(187 92% 42%)",
                  }} />
                  {text}
                </span>
              ))}
            </div>

            {/* Terminal-style message */}
            <div className="w-full max-w-md glass-card rounded-xl p-5 text-left font-mono text-sm" style={{
              border: "1px solid hsl(217 91% 60% / 0.2)"
            }}>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-3 h-3 rounded-full" style={{ background: "hsl(0 70% 50%)" }} />
                <span className="w-3 h-3 rounded-full" style={{ background: "hsl(45 100% 55%)" }} />
                <span className="w-3 h-3 rounded-full" style={{ background: "hsl(142 70% 45%)" }} />
                <span className="text-muted-foreground text-xs ml-2">terminal</span>
              </div>
              <div className="space-y-1.5 text-muted-foreground">
                <p><span className="text-accent">$</span> git status</p>
                <p className="text-primary">En rama: <span className="text-accent">main</span></p>
                <p><span className="text-accent">$</span> npm run build:projects</p>
                <p className="text-foreground/60">⠋ Compilando proyectos increíbles...</p>
                <p className="text-primary flex items-center gap-1">
                  <span className="inline-block w-1.5 h-4 bg-accent" style={{ animation: "blink 1s step-end infinite" }} />
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
