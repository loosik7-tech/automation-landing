import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import SectionDivider from "./components/SectionDivider";
import ProblemSolution from "./components/ProblemSolution";
import Benefits from "./components/Benefits";
import HowItWorks from "./components/HowItWorks";
import DemoChat from "./components/DemoChat";
import Niches from "./components/Niches";
import WhyMe from "./components/WhyMe";
import ContactForm from "./components/ContactForm";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <main style={{ width: "100%" }}>
      <Navbar />
      <Hero />
      <SectionDivider to="white" />
      <ProblemSolution />
      <SectionDivider to="bg" />
      <Benefits />
      <HowItWorks />
      <DemoChat />
      <WhyMe />
      <Niches />
      <ContactForm />
      <Footer />
    </main>
  );
}
