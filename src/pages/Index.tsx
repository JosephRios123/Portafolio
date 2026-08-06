import { useEffect, useRef, useState } from "react";
import Navbar from "@/components/portfolio/Navbar";
import Hero from "@/components/portfolio/Hero";
import Projects from "@/components/portfolio/Projects";
import Experience from "@/components/portfolio/Experience";
import Mindset from "@/components/portfolio/Mindset";
import About from "@/components/portfolio/About";
import Education from "@/components/portfolio/Education";
import Skills from "@/components/portfolio/Skills";
import Contact from "@/components/portfolio/Contact";
import ProfessionalEvents from "@/components/portfolio/ProfessionalEvents";
import EasterEggs from "@/components/portfolio/EasterEggs";

const Index = () => {
  const trackRef = useRef<HTMLElement>(null);
  const [activeChapter, setActiveChapter] = useState(0);
  const [chapterCount, setChapterCount] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || window.matchMedia("(max-width: 767px)").matches) return;
    const sections = Array.from(track.querySelectorAll<HTMLElement>(":scope > section"));
    setChapterCount(sections.length);
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && setActiveChapter(sections.indexOf(entry.target as HTMLElement))),
      { root: track, threshold: 0.6 },
    );
    sections.forEach((section) => observer.observe(section));
    const onWheel = (event: WheelEvent) => {
      const target = event.target as HTMLElement;
      const section = target.closest<HTMLElement>(".chapter-section");
      if (!section) return;
      if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
      const canScrollDown = section.scrollTop + section.clientHeight < section.scrollHeight - 2;
      const canScrollUp = section.scrollTop > 2;
      if ((event.deltaY > 0 && canScrollDown) || (event.deltaY < 0 && canScrollUp)) return;
      event.preventDefault();
      track.scrollBy({ left: event.deltaY, behavior: "auto" });
    };
    track.addEventListener("wheel", onWheel, { passive: false });
    return () => { observer.disconnect(); track.removeEventListener("wheel", onWheel); };
  }, []);

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <Navbar />
      <EasterEggs />
      <main id="chapters" ref={trackRef} className="chapter-track">
        <Hero />
        <Projects />
        <Experience />
        <Mindset />
        <About />
        <Education />
        <ProfessionalEvents />
        <Skills />
        <Contact />
      </main>
      <div className="fixed bottom-5 left-1/2 z-40 hidden -translate-x-1/2 items-center gap-2 rounded-full border border-border bg-background/80 px-4 py-2 backdrop-blur-xl md:flex" aria-label={`Capítulo ${activeChapter + 1} de ${chapterCount}`}>
        {Array.from({ length: chapterCount }, (_, index) => <span key={index} className={`h-1.5 rounded-full transition-all ${index === activeChapter ? "w-7 bg-accent" : "w-1.5 bg-muted-foreground/40"}`} />)}
      </div>
    </div>
  );
};

export default Index;
