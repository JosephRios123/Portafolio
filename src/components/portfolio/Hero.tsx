import { useEffect, useRef, useState } from "react";
import { ArrowDown, ExternalLink, Mail, Download } from "lucide-react";
import { generateCV } from "@/lib/generateCV";

const TYPING_TEXTS = [
  "Desarrollador Backend",
  "Arquitecto de soluciones escalables",
  "Manteniendo siempre buenas prácticas",
  "Preparado para cualquier adversidad",
];

function useTypewriter(texts: string[], speed = 80, pause = 2000) {
  const [display, setDisplay] = useState("");
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = texts[textIndex];
    let timeout: ReturnType<typeof setTimeout>;

    if (!deleting && charIndex < current.length) {
      timeout = setTimeout(() => setCharIndex((c) => c + 1), speed);
    } else if (!deleting && charIndex === current.length) {
      timeout = setTimeout(() => setDeleting(true), pause);
    } else if (deleting && charIndex > 0) {
      timeout = setTimeout(() => setCharIndex((c) => c - 1), speed / 2);
    } else if (deleting && charIndex === 0) {
      setDeleting(false);
      setTextIndex((i) => (i + 1) % texts.length);
    }

    setDisplay(current.slice(0, charIndex));
    return () => clearTimeout(timeout);
  }, [charIndex, deleting, textIndex, texts, speed, pause]);

  return display;
}

// Decorative floating particles
function Particles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 rounded-full opacity-30"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: i % 2 === 0 ? "hsl(217 91% 60%)" : "hsl(187 92% 42%)",
            animation: `particle-float ${8 + Math.random() * 8}s linear ${Math.random() * 5}s infinite`,
          }}
        />
      ))}
      {/* Code decorations */}
      {["</>", "{ }", "=>", "//", "const", "async", "return", "import"].map((txt, i) => (
        <div
          key={txt}
          className="absolute font-mono text-xs select-none"
          style={{
            left: `${5 + (i * 13) % 90}%`,
            top: `${10 + (i * 17) % 80}%`,
            color: i % 2 === 0 ? "hsl(217 91% 60% / 0.12)" : "hsl(187 92% 42% / 0.12)",
            fontSize: `${10 + (i % 3) * 4}px`,
            animation: `float ${4 + i}s ease-in-out ${i * 0.5}s infinite`,
          }}
        >
          {txt}
        </div>
      ))}
    </div>
  );
}

export default function Hero() {
  const typedText = useTypewriter(TYPING_TEXTS);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse 80% 60% at 50% -10%, hsl(217 91% 60% / 0.15) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 80% 80%, hsl(187 92% 42% / 0.1) 0%, transparent 50%), hsl(var(--background))",
      }}
    >
      <Particles />

      {/* Animated grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(hsl(217 91% 60% / 0.04) 1px, transparent 1px), linear-gradient(90deg, hsl(217 91% 60% / 0.04) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium mb-8 animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          Disponible para nuevas oportunidades
        </div>

        {/* Name */}
        <h1
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight mb-6 leading-none"
          style={{ animationDelay: "0.1s" }}
        >
          <span className="block text-foreground">Jose Manuel</span>
          <span className="block gradient-text">Rios Restrepo</span>
        </h1>

        {/* Typewriter */}
        <div className="h-12 flex items-center justify-center mb-6">
          <p className="text-xl sm:text-2xl md:text-3xl font-bold text-muted-foreground font-mono">
            <span className="text-accent">&gt; </span>
            <span>{typedText}</span>
            <span
              className="inline-block w-0.5 h-7 bg-accent ml-1 align-middle"
              style={{ animation: "blink 1s step-end infinite" }}
            />
          </p>
        </div>

        {/* Authority phrase */}
        <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed">
          "Construyo soluciones{" "}
          <span className="text-accent font-semibold">eficientes, escalables</span> y orientadas a resultados con{" "}
          <span className="text-primary font-semibold">código limpio</span> y mentalidad estratégica."
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#projects"
            className="group flex items-center gap-2 px-8 py-4 rounded-full gradient-bg text-background font-bold text-lg hover:opacity-90 hover:scale-105 transition-all duration-300"
            style={{ boxShadow: "0 0 40px hsl(217 91% 60% / 0.4), 0 8px 32px hsl(187 92% 42% / 0.2)" }}
          >
            Ver proyectos
            <ExternalLink size={18} className="group-hover:rotate-12 transition-transform" />
          </a>
          <a
            href="#contact"
            className="group flex items-center gap-2 px-8 py-4 rounded-full border-2 border-primary/50 text-primary font-bold text-lg hover:border-accent hover:text-accent hover:bg-accent/5 transition-all duration-300"
          >
            Contactar
            <Mail size={18} className="group-hover:scale-110 transition-transform" />
          </a>
          <button
            onClick={() => generateCV()}
            className="group flex items-center gap-2 px-8 py-4 rounded-full border-2 border-accent/50 text-accent font-bold text-lg hover:border-primary hover:text-primary hover:bg-primary/5 transition-all duration-300 active:scale-95"
          >
            Descargar CV
            <Download size={18} className="group-hover:translate-y-0.5 transition-transform" />
          </button>
        </div>

        {/* Scroll indicator */}
        <div className="mt-20 flex flex-col items-center gap-2 text-muted-foreground/60 text-sm">
          <span>Scroll para explorar</span>
          <div
            className="w-6 h-10 rounded-full border-2 border-muted-foreground/20 flex items-start justify-center p-1"
          >
            <div
              className="w-1.5 h-3 rounded-full bg-primary"
              style={{ animation: "scroll-bounce 2s ease-in-out infinite" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
