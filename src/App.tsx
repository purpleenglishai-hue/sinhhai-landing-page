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

// Nếu bạn đã có file PaymentPage.tsx ở src/PaymentPage.tsx, bỏ comment dòng dưới và xóa component PaymentPageFallback phía dưới:
// import { PaymentPage } from "./PaymentPage";

import "./App.css";

// Component Trang Thanh Toán hiển thị khi truy cập /checkout
function PaymentPageFallback() {
  return (
    <div className="container py-12 min-h-[70vh] flex flex-col items-center justify-center text-center">
      <h1 className="text-3xl font-bold text-purple-600 mb-4">Trang Thanh Toán SinhHAI</h1>
      <p className="text-muted-foreground mb-6 max-w-md">
        Chào mừng bạn đến với trang thanh toán. Vui lòng chọn gói cước dịch vụ để tiếp tục.
      </p>
      <a
        href="/"
        className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
      >
        Quay lại trang chủ
      </a>
    </div>
  );
}

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
        <PaymentPageFallback />
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
