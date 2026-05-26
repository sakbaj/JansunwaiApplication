import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { Hero } from "@/components/landing/Hero";
import { AIPlayground } from "@/components/landing/AIPlayground";
import { Features } from "@/components/landing/Features";
import { DemoWorkflow } from "@/components/landing/DemoWorkflow";
import { Statistics } from "@/components/landing/Statistics";
import { Testimonials } from "@/components/landing/Testimonials";
import { CTA } from "@/components/landing/CTA";
import { ScrollReveal } from "@/components/shared/ScrollReveal";

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main>
        <ScrollReveal delay={0.1}><Hero /></ScrollReveal>
        <ScrollReveal delay={0.2}><AIPlayground /></ScrollReveal>
        <ScrollReveal delay={0.2}><Features /></ScrollReveal>
        <ScrollReveal delay={0.2}><DemoWorkflow /></ScrollReveal>
        <ScrollReveal delay={0.2}><Statistics /></ScrollReveal>
        <ScrollReveal delay={0.2}><Testimonials /></ScrollReveal>
        <ScrollReveal delay={0.2}><CTA /></ScrollReveal>
      </main>
      <Footer />
    </>
  );
}

