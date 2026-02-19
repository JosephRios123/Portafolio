import Navbar from "@/components/portfolio/Navbar";
import Hero from "@/components/portfolio/Hero";
import Projects from "@/components/portfolio/Projects";
import Experience from "@/components/portfolio/Experience";
import Mindset from "@/components/portfolio/Mindset";
import About from "@/components/portfolio/About";
import Education from "@/components/portfolio/Education";
import Skills from "@/components/portfolio/Skills";
import Contact from "@/components/portfolio/Contact";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <Hero />
        <Projects />
        <Experience />
        <Mindset />
        <About />
        <Education />
        <Skills />
        <Contact />
      </main>
    </div>
  );
};

export default Index;
