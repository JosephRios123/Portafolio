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
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <Navbar />
      <EasterEggs />
      <main id="chapters" className="chapter-track">
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
    </div>
  );
};

export default Index;
