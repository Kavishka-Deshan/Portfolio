import Navbar from "@/components/sections/Navbar";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Skills from "@/components/sections/Skills";
import Projects from "@/components/sections/Projects";
import Education from "@/components/sections/Education";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";
import ScrollProgress from "@/components/ui/ScrollProgress";
import BackToTop from "@/components/ui/BackToTop";
import Cursor from "@/components/effects/Cursor";
import Scanlines from "@/components/effects/Scanlines";
import SectionTransition from "@/components/effects/SectionTransition";
import FloatingAction from "@/components/ui/FloatingAction";

export default function Home() {
  return (
    <>
      <Cursor />
      <Scanlines />
      <ScrollProgress />
      <BackToTop />
      <FloatingAction />
      <Navbar />
      <main>
        <Hero />
        <SectionTransition>
          <About />
        </SectionTransition>
        <SectionTransition>
          <Skills />
        </SectionTransition>
        <SectionTransition>
          <Projects />
        </SectionTransition>
        <SectionTransition>
          <Education />
        </SectionTransition>
        <SectionTransition>
          <Contact />
        </SectionTransition>
      </main>
      <Footer />
    </>
  );
}
