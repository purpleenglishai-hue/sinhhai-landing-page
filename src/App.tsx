import { useState, useEffect } from "react";
import { About } from "./components/About";
import { Cta } from "./components/Cta";
import { FAQ } from "./components/FAQ";
import { Features } from "./components/Features";
import { Footer } from "./components/Footer";
import { Hero } from "./components/Hero";
import { HowItWorks } from "./components/HowItWorks";
import { Navbar } from "./components/Navbar";
import { Newsletter } from "./components/Newsletter";
import { Pricing } from "./components/Pricing";
import { ScrollToTop } from "./components/ScrollToTop";
import { Services } from "./components/Services";
import { Sponsors } from "./components/Sponsors";
import { Team } from "./components/Team";
import { Testimonials } from "./components/Testimonials";

import { PaymentPage } from "../PaymentPage";

import "./App.css";

function App() {
  const [currentPath, setCurrentPath] = useState<string>(window.location.pathname);

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener("popstate", handleLocationChange);
    return () => window.removeEventListener("popstate", handleLocationChange);
  }, []);

  const isCheckout = currentPath === "/checkout";

  return (
    <>
      <Navbar />

      {isCheckout ? (
        <PaymentPage onBack={() => (window.location.href = "/")} />
      ) : (
        <>
          <Hero />
          <Sponsors />
          <About />
          <HowItWorks />
          <Features />
          <Services />
          <Cta />
          <Testimonials />
          <Team />
          <Pricing />
          <Newsletter />
          <FAQ />
        </>
      )}

      <Footer />
      <ScrollToTop />
    </>
  );
}

export default App;
