import React from "react";
import Hero from "../components/Hero";
import Features from "../components/Features";
import Modules from "../components/Modules";
import Alerts from "../components/Alerts";
import CTA from "../components/CTA";
import Footer from "../components/Footer";

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen text-slate-800 bg-gradient-to-b from-white to-slate-50">
      <main>
        <Hero />
        <Features />
        <Modules />
        <Alerts />
        <CTA />
      </main>
    </div>
  );
};

export default LandingPage;
