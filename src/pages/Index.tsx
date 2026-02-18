import Navbar from "@/components/portfolio/Navbar";
import Hero from "@/components/portfolio/Hero";
import About from "@/components/portfolio/About";
import TechStack from "@/components/portfolio/TechStack";
import Experience from "@/components/portfolio/Experience";
import Mindset from "@/components/portfolio/Mindset";
import Education from "@/components/portfolio/Education";
import Learning from "@/components/portfolio/Learning";
import Skills from "@/components/portfolio/Skills";
import Contact from "@/components/portfolio/Contact";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <Hero />
        <About />
        <TechStack />
        <Experience />
        <Mindset />
        <Education />
        <Learning />
        <Skills />
        <Contact />
      </main>
    </div>
  );
};

export default Index;
