"use client";

import { useEffect, useRef, useState } from "react";
import {
  Menu,
  Calendar,
  Factory,
  Award,
  ChevronsDown,
  Quote,
  Briefcase,
  Mic,
  UserCheck,
  Settings,
  Trophy,
  User,
  Users,
  Megaphone,
  Globe,
  Coins,
  Check,
  ChevronDown,
  Phone,
  Mail,
  Edit3,
  X,
} from "lucide-react";

// Counter logic component
function CounterItem({ target, isTriggered }: { target: number; isTriggered: boolean }) {
  const [count, setCount] = useState(0);
  const counted = useRef(false);

  useEffect(() => {
    if (isTriggered && !counted.current) {
      counted.current = true;
      let current = 0;
      const step = Math.ceil(target / 40) || 1;
      const interval = setInterval(() => {
        current += step;
        if (current >= target) {
          current = target;
          clearInterval(interval);
        }
        setCount(current);
      }, 35);
      return () => clearInterval(interval);
    }
  }, [isTriggered, target]);

  return <>{count}</>;
}

export default function Home() {
  const [lang, setLang] = useState<"hi" | "en">("hi");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [moduleFilter, setModuleFilter] = useState("all");
  const [openDivisions, setOpenDivisions] = useState<Record<number, boolean>>({});
  const [openFaqs, setOpenFaqs] = useState<Record<number, boolean>>({});
  const [triggeredCounters, setTriggeredCounters] = useState<Record<string, boolean>>({});
  const [enquiryModalOpen, setEnquiryModalOpen] = useState(false);

  // Form states
  const [modalForm, setModalForm] = useState({
    name: "",
    mobile: "",
    city: "",
    qual: "",
    batch: "",
    msg: "",
    consent: false,
  });
  const [modalSubmitStatus, setModalSubmitStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const [contactForm, setContactForm] = useState({
    name: "",
    mobile: "",
    email: "",
    message: "",
  });

  // Language toggle helper
  const t = (hi: React.ReactNode, en: React.ReactNode) => {
    return lang === "hi" ? hi : en;
  };

  // Sticky header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Hero Slider (cycles every 5000ms)
  useEffect(() => {
    const slideInterval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(slideInterval);
  }, []);

  // IntersectionObserver for counters
  useEffect(() => {
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const id = e.target.getAttribute("data-id");
            if (id) {
              setTriggeredCounters((prev) => ({ ...prev, [id]: true }));
            }
          }
        });
      },
      { threshold: 0.2 }
    );

    document.querySelectorAll(".counter-target").forEach((el) => counterObserver.observe(el));

    return () => {
      counterObserver.disconnect();
    };
  }, []);

  // IntersectionObserver for general fade-up
  useEffect(() => {
    const fadeObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll(".fade-up").forEach((el) => fadeObserver.observe(el));

    return () => {
      fadeObserver.disconnect();
    };
  }, []);

  // Scroll highlight for admission steps
  useEffect(() => {
    const handleScroll = () => {
      const triggerOffset = window.innerHeight * 0.75;
      const steps = document.querySelectorAll(".admission-step");
      steps.forEach((step) => {
        const rect = step.getBoundingClientRect();
        const stepCenter = rect.top + rect.height / 2;
        const badge = step.querySelector(".step-badge");
        if (stepCenter < triggerOffset) {
          step.classList.remove("opacity-60", "scale-95");
          step.classList.add("opacity-100", "scale-100", "border-gold", "shadow-md");
          if (badge) {
            badge.classList.remove("bg-white", "border-navy/20", "text-navy/60");
            badge.classList.add("bg-gold", "border-gold", "text-navy", "scale-110");
          }
        } else {
          step.classList.add("opacity-60", "scale-95");
          step.classList.remove("opacity-100", "scale-100", "border-gold", "shadow-md");
          if (badge) {
            badge.classList.add("bg-white", "border-navy/20", "text-navy/60");
            badge.classList.remove("bg-gold", "border-gold", "text-navy", "scale-110");
          }
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    const timer = setTimeout(handleScroll, 500);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timer);
    };
  }, []);

  const toggleLanguage = () => {
    setLang((prev) => (prev === "hi" ? "en" : "hi"));
  };

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalSubmitStatus("loading");

    const record = {
      full_name: modalForm.name,
      mobile: modalForm.mobile,
      city: modalForm.city,
      qualification: modalForm.qual,
      preferred_batch: modalForm.batch,
      message: modalForm.msg,
      submitted_at: new Date().toISOString(),
    };

    try {
      // Simulate/SDK Submission
      const sdk = (window as unknown as { dataSdk?: { create?: (rec: Record<string, unknown>) => Promise<{ isOk: boolean }> } }).dataSdk;
      if (sdk && typeof sdk.create === "function") {
        const res = await sdk.create(record);
        if (res?.isOk) {
          setModalSubmitStatus("success");
        } else {
          setModalSubmitStatus("error");
        }
      } else {
        // Fallback success
        setModalSubmitStatus("success");
      }
    } catch {
      setModalSubmitStatus("error");
    }

    // Reset status and close modal after 3 seconds on success
    setTimeout(() => {
      setEnquiryModalOpen(false);
      setModalSubmitStatus("idle");
      setModalForm({
        name: "",
        mobile: "",
        city: "",
        qual: "",
        batch: "",
        msg: "",
        consent: false,
      });
    }, 3000);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactForm({
      name: "",
      mobile: "",
      email: "",
      message: "",
    });
    alert(t("आपका संदेश सफलतापूर्वक भेजा गया!", "Your message has been sent successfully!"));
  };

  const modules = [
    { cat: "career", hi: "Personality Development", en: "Personality Development" },
    { cat: "career", hi: "Interview Process", en: "Interview Process" },
    { cat: "career", hi: "Professional Communication", en: "Professional Communication" },
    { cat: "career", hi: "Resume Preparation", en: "Resume Preparation" },
    { cat: "career", hi: "Time Management", en: "Time Management" },
    { cat: "hr", hi: "HR Office Management", en: "HR Office Management" },
    { cat: "hr", hi: "Recruitment Process", en: "Recruitment Process" },
    { cat: "hr", hi: "Data Management", en: "Data Management" },
    { cat: "hr", hi: "Company Entry & Visitor Process", en: "Company Entry & Visitor Process" },
    { cat: "marketing", hi: "Domestic Enquiry Generation", en: "Domestic Enquiry Generation" },
    { cat: "marketing", hi: "Customer Relationship Management", en: "Customer Relationship Management" },
    { cat: "marketing", hi: "Calling & Messaging", en: "Calling & Messaging" },
    { cat: "marketing", hi: "Quotation Preparation", en: "Quotation Preparation" },
    { cat: "marketing", hi: "Order Finalization", en: "Order Finalization" },
    { cat: "marketing", hi: "Feedback & Follow-up", en: "Feedback & Follow-up" },
    { cat: "export", hi: "Export Marketing", en: "Export Marketing" },
    { cat: "export", hi: "International Email Drafting", en: "International Email Drafting" },
    { cat: "export", hi: "Overseas Buyer Search", en: "Overseas Buyer Search" },
    { cat: "export", hi: "International Enquiry Generation", en: "International Enquiry Generation" },
    { cat: "export", hi: "International Quotation", en: "International Quotation" },
    { cat: "export", hi: "Buyer-Seller Agreement", en: "Buyer-Seller Agreement" },
    { cat: "export", hi: "International Payment & Banking", en: "International Payment & Banking" },
    { cat: "export", hi: "Sampling & Packing", en: "Sampling & Packing" },
    { cat: "production", hi: "Vendor Development", en: "Vendor Development" },
    { cat: "production", hi: "Rate Comparison", en: "Rate Comparison" },
    { cat: "production", hi: "Purchase Process", en: "Purchase Process" },
    { cat: "production", hi: "Production Basics", en: "Production Basics" },
    { cat: "production", hi: "Product Quality", en: "Product Quality" },
    { cat: "production", hi: "Packing & Logistics", en: "Packing & Logistics" },
    { cat: "production", hi: "Dispatch", en: "Dispatch" },
    { cat: "finance", hi: "Billing & Taxation Basics", en: "Billing & Taxation Basics" },
    { cat: "finance", hi: "Account Activities", en: "Account Activities" },
    { cat: "finance", hi: "Payment Safety", en: "Payment Safety" },
    { cat: "finance", hi: "Export Incentive Documentation", en: "Export Incentive Documentation" },
  ];

  const catMeta: Record<string, { icon: string; color: string }> = {
    career: { icon: "user", color: "text-amber-600 bg-amber-50 border-amber-200/60" },
    hr: { icon: "users", color: "text-blue-600 bg-blue-50 border-blue-200/60" },
    marketing: { icon: "megaphone", color: "text-emerald-600 bg-emerald-50 border-emerald-200/60" },
    export: { icon: "globe", color: "text-indigo-600 bg-indigo-50 border-indigo-200/60" },
    production: { icon: "factory", color: "text-purple-600 bg-purple-50 border-purple-200/60" },
    finance: { icon: "coins", color: "text-rose-600 bg-rose-50 border-rose-200/60" },
  };

  const getModuleIcon = (cat: string) => {
    switch (cat) {
      case "career":
        return <User className="w-5 h-5" />;
      case "hr":
        return <Users className="w-5 h-5" />;
      case "marketing":
        return <Megaphone className="w-5 h-5" />;
      case "export":
        return <Globe className="w-5 h-5" />;
      case "production":
        return <Factory className="w-5 h-5" />;
      case "finance":
        return <Coins className="w-5 h-5" />;
      default:
        return <Settings className="w-5 h-5" />;
    }
  };

  const filteredModules = moduleFilter === "all" ? modules : modules.filter((m) => m.cat === moduleFilter);

  const divisions = [
    { title: "Business Training College", contentHi: "45-Day Internship & Business Training Program", contentEn: "45-Day Internship & Business Training Program" },
    { title: "Business Project & Partnership", contentHi: "Vision / Proposed Initiative", contentEn: "Vision / Proposed Initiative" },
    { title: "Government & Public-Benefit Project Development", contentHi: "Vision / Proposed Initiative", contentEn: "Vision / Proposed Initiative" },
    { title: "Rubber Industry Development", contentHi: "Vision / Proposed Initiative", contentEn: "Vision / Proposed Initiative" },
    { title: "Family & Highway Dhaba Social Initiative", contentHi: "Vision / Proposed Initiative", contentEn: "Vision / Proposed Initiative" },
    { title: "Beauty, Safety & Health Initiative", contentHi: "Vision / Proposed Initiative", contentEn: "Vision / Proposed Initiative" },
    { title: "Health Care & Entertainment Park Concept", contentHi: "Vision / Proposed Initiative", contentEn: "Vision / Proposed Initiative" },
    { title: "Public Leadership & Degree College Concept", contentHi: "Vision / Proposed Initiative", contentEn: "Vision / Proposed Initiative" },
  ];

  const faqs = [
    {
      qHi: "यह program किसके लिए है?",
      qEn: "Who is this program for?",
      aHi: "यह program graduates, postgraduates और job seekers के लिए है जो practical business skills सीखना चाहते हैं।",
      aEn: "This program is for graduates, postgraduates and job seekers who want to learn practical business skills.",
    },
    {
      qHi: "Program की अवधि कितनी है?",
      qEn: "What is the program duration?",
      aHi: "45 दिन का structured internship एवं business training program।",
      aEn: "45-day structured internship and business training program.",
    },
    {
      qHi: "क्या industrial visit शामिल है?",
      qEn: "Is industrial visit included?",
      aHi: "हाँ, schedule और availability के अनुसार industrial exposure दिया जाता है।",
      aEn: "Yes, industrial exposure is provided subject to schedule and availability.",
    },
    {
      qHi: "क्या certificate दिया जाएगा?",
      qEn: "Will a certificate be provided?",
      aHi: "हाँ, program पूरा होने पर internship certificate प्रदान किया जाता है।",
      aEn: "Yes, an internship certificate is provided upon program completion.",
    },
    {
      qHi: "Training Hindi या English में होगी?",
      qEn: "Will training be in Hindi or English?",
      aHi: "Training primarily Hindi में होती है, English communication भी सिखाई जाती है।",
      aEn: "Training is primarily in Hindi; English communication is also taught.",
    },
    {
      qHi: "Admission process क्या है?",
      qEn: "What is the admission process?",
      aHi: "Enquiry → Counselling → Batch confirmation → Documents → Admission → Training start",
      aEn: "Enquiry → Counselling → Batch confirmation → Documents → Admission → Training start",
    },
    {
      qHi: "क्या placement assistance उपलब्ध है?",
      qEn: "Is placement assistance available?",
      aHi: "संस्थान career guidance और placement-related assistance दे सकता है; employment किसी employer की selection process, vacancy, skills और candidate performance पर निर्भर करेगा।",
      aEn: "The institute can provide career guidance and placement-related assistance; employment depends on employer selection process, vacancy, skills and candidate performance.",
    },
    {
      qHi: "Fees और batch timings कैसे जानें?",
      qEn: "How to know fees and batch timings?",
      aHi: "Enquiry form भरें या counsellor से संपर्क करें।",
      aEn: "Fill the enquiry form or contact the counsellor.",
    },
    {
      qHi: "क्या बाहर के विद्यार्थी apply कर सकते हैं?",
      qEn: "Can outstation students apply?",
      aHi: "हाँ, किसी भी शहर के students apply कर सकते हैं।",
      aEn: "Yes, students from any city can apply.",
    },
  ];

  return (
    <div className={`min-h-screen bg-ivory text-navy ${lang === "en" ? "lang-en" : ""}`}>
      {/* Header */}
      <header
        id="site-header"
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${scrolled ? "header-solid" : ""}`}
        style={{
          background: scrolled ? "#071B3F" : "rgba(7,27,63,0.08)",
          backdropFilter: scrolled ? "none" : "blur(10px)",
        }}
      >
        <nav className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gold flex items-center justify-center font-heading font-bold text-navy text-sm shadow-md">
              IG
            </div>
            <span className="font-heading font-bold text-white text-sm hidden sm:block tracking-wide">IGPSO</span>
          </div>

          <div className="hidden lg:flex items-center gap-6">
            <a href="#home" className="nav-link text-white text-sm font-medium">
              {t("होम", "Home")}
            </a>
            <a href="#about" className="nav-link text-white text-sm font-medium">
              {t("परिचय", "About")}
            </a>
            <a href="#program" className="nav-link text-white text-sm font-medium">
              {t("45-दिवसीय प्रोग्राम", "45-Day Program")}
            </a>
            <a href="#modules" className="nav-link text-white text-sm font-medium">
              {t("मॉड्यूल", "Modules")}
            </a>
            <a href="#industrial" className="nav-link text-white text-sm font-medium">
              {t("औद्योगिक अनुभव", "Industrial")}
            </a>
            <a href="#projects" className="nav-link text-white text-sm font-medium">
              {t("प्रोजेक्ट्स", "Projects")}
            </a>
            <a href="#admissions" className="nav-link text-white text-sm font-medium">
              {t("प्रवेश", "Admissions")}
            </a>
            <a href="#contact" className="nav-link text-white text-sm font-medium">
              {t("संपर्क", "Contact")}
            </a>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleLanguage}
              className="text-white text-xs font-semibold border border-gold/50 rounded-full px-3 py-1 hover:bg-gold hover:text-navy transition-all duration-300"
            >
              हि | En
            </button>
            <button
              onClick={() => setEnquiryModalOpen(true)}
              className="hidden sm:inline-block bg-gold text-navy font-heading font-bold text-sm px-4 py-2 rounded-full hover:bg-yellow-400 transition-all duration-300 gold-glow"
            >
              Apply Now
            </button>
            <button onClick={() => setMobileMenuOpen((prev) => !prev)} className="lg:hidden text-white" aria-label="Toggle menu">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        <div className={`lg:hidden bg-navy/95 backdrop-blur-lg px-4 pb-4 ${mobileMenuOpen ? "" : "hidden"}`}>
          <a href="#home" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-white text-sm border-b border-white/10">
            {t("होम", "Home")}
          </a>
          <a href="#about" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-white text-sm border-b border-white/10">
            {t("परिचय", "About")}
          </a>
          <a href="#program" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-white text-sm border-b border-white/10">
            {t("45-दिवसीय प्रोग्राम", "45-Day Program")}
          </a>
          <a href="#modules" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-white text-sm border-b border-white/10">
            {t("मॉड्यूल", "Modules")}
          </a>
          <a href="#industrial" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-white text-sm border-b border-white/10">
            {t("औद्योगिक अनुभव", "Industrial")}
          </a>
          <a href="#projects" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-white text-sm border-b border-white/10">
            {t("प्रोजेक्ट्स", "Projects")}
          </a>
          <a href="#admissions" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-white text-sm border-b border-white/10">
            {t("प्रवेश", "Admissions")}
          </a>
          <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-white text-sm">
            {t("संपर्क", "Contact")}
          </a>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section id="home" className="relative w-full overflow-hidden" style={{ height: "calc(100 * min(var(--vh, 1vh), 1vh))", minHeight: "100vh" }}>
          <div className="absolute inset-0">
            <div className={`hero-slide ${activeSlide === 0 ? "active" : ""}`}>
              <img
                src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1200"
                alt="Business training"
                className="w-full h-full object-cover"
                loading="eager"
              />
            </div>
            <div className={`hero-slide ${activeSlide === 1 ? "active" : ""}`}>
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1200"
                alt="Student seminar"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className={`hero-slide ${activeSlide === 2 ? "active" : ""}`}>
              <img
                src="https://images.unsplash.com/photo-1542744094-3a31f103e35f?auto=format&fit=crop&q=80&w=1200"
                alt="Practical exposure"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>

          <div className="absolute inset-0 bg-gradient-to-b from-navy/85 via-navy/60 to-navy/95"></div>
          {/* Decorative grid overlay */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          ></div>

          <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4 max-w-5xl mx-auto pt-20">
            <div className="flex items-center gap-2 mb-5">
              <div className="pulse-dot"></div>
              <p className="text-gold font-heading font-semibold text-sm md:text-base tracking-wide">
                {t("45-दिवसीय व्यावहारिक व्यावसायिक प्रशिक्षण एवं इंटर्नशिप", "45-DAY BUSINESS TRAINING & INTERNSHIP")}
              </p>
            </div>

            <h1 className="font-hindi font-bold text-white text-2xl md:text-4xl lg:text-5xl leading-tight mb-3">
              {t("क्लासरूम और कॉर्पोरेट जगत के बीच की दूरी को मिटाएं", "Bridge the Gap Between Classroom and Corporate World")}
            </h1>

            <p className="text-white/85 text-sm md:text-base max-w-3xl mb-8 font-hindi leading-relaxed">
              {t(
                "IGPSO इंदौर के साथ कम्युनिकेशन, एचआर, मार्केटिंग, एक्सपोर्ट, प्रोडक्शन और लॉजिस्टिक्स में व्यावहारिक अनुभव प्राप्त करें। जॉब मार्केट में सफल होने के लिए तैयार रहें।",
                "Gain practical experience in Communication, HR, Marketing, Export, Production, and Logistics with IGPSO Indore. Get ready to stand out in the job market."
              )}
            </p>

            <div className="flex flex-wrap gap-4 justify-center mb-8">
              <button
                onClick={() => setEnquiryModalOpen(true)}
                className="bg-gold text-navy font-heading font-bold px-7 py-3.5 rounded-full text-sm md:text-base hover:bg-yellow-400 transition-all duration-300 gold-glow shadow-lg"
              >
                {t("अभी आवेदन करें", "Apply Now")}
              </button>
              <a
                href="#program"
                className="border-2 border-white/80 text-white font-heading font-semibold px-7 py-3.5 rounded-full text-sm md:text-base hover:bg-white hover:text-navy transition-all duration-300"
              >
                {t("प्रोग्राम जानें", "Explore Program")}
              </a>
            </div>

            <div className="flex flex-wrap gap-3 justify-center">
              <span className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-white text-xs font-medium flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 opacity-70" />
                {t("45 दिन Practical Training", "45 Days Practical Training")}
              </span>
              <span className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-white text-xs font-medium flex items-center gap-2">
                <Factory className="w-3.5 h-3.5 opacity-70" />
                {t("Industrial Exposure", "Industrial Exposure")}
              </span>
              <span className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-white text-xs font-medium flex items-center gap-2">
                <Award className="w-3.5 h-3.5 opacity-70" />
                {t("Internship Certificate", "Internship Certificate")}
              </span>
            </div>

            <div className="scroll-indicator absolute bottom-8">
              <ChevronsDown className="w-7 h-7 text-white animate-bounce" />
            </div>
          </div>
        </section>

        {/* Trust Strip */}
        <section className="py-14 relative">
          <div className="absolute top-0 left-0 right-0 section-divider"></div>
          <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
            <div className="fade-up">
              <p className="text-4xl font-heading font-bold text-gradient counter-target" data-id="days">
                <CounterItem target={45} isTriggered={!!triggeredCounters["days"]} />
              </p>
              <p className="text-xs text-navy/70 mt-1 font-medium">{t("दिन Training", "Days Training")}</p>
            </div>
            <div className="fade-up">
              <p className="text-4xl font-heading font-bold text-gradient counter-target" data-id="topics">
                <CounterItem target={40} isTriggered={!!triggeredCounters["topics"]} />+
              </p>
              <p className="text-xs text-navy/70 mt-1 font-medium">{t("40+ Business Topics", "40+ Business Topics")}</p>
            </div>
            <div className="fade-up">
              <p className="text-4xl font-heading font-bold text-gradient">✓</p>
              <p className="text-xs text-navy/70 mt-1 font-medium">{t("Industrial Exposure", "Industrial Exposure")}</p>
            </div>
            <div className="fade-up">
              <p className="text-4xl font-heading font-bold text-gradient counter-target" data-id="concepts">
                <CounterItem target={10} isTriggered={!!triggeredCounters["concepts"]} />
              </p>
              <p className="text-xs text-navy/70 mt-1 font-medium">{t("Smart City Concepts", "Smart City Concepts")}</p>
            </div>
            <div className="fade-up">
              <p className="text-4xl font-heading font-bold text-gradient">25+</p>
              <p className="text-xs text-navy/70 mt-1 font-medium">{t("शहरों का विज़न", "Cities Vision")}</p>
            </div>
          </div>
          <p className="text-center text-[10px] text-navy/40 mt-4 px-4">
            {t(
              "Expansion figures represent the organization's stated future vision.",
              "Expansion figures represent the organization's stated future vision."
            )}
          </p>
        </section>

        {/* About Section */}
        <section id="about" className="py-20 bg-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center relative z-10">
            <div className="fade-up rounded-3xl overflow-hidden shadow-2xl shadow-navy/10">
              <img
                src="https://images.unsplash.com/photo-1531538606174-0f90ff5dce83?auto=format&fit=crop&q=80&w=600"
                alt="About IGPSO"
                className="w-full h-72 md:h-96 object-cover"
                loading="lazy"
              />
            </div>
            <div className="fade-up">
              <h2 className="font-heading font-bold text-navy text-2xl md:text-3xl mb-4">
                {t("IGPSO इंदौर के बारे में", "About IGPSO Indore")}
              </h2>
              <p className="text-navy/75 text-sm leading-relaxed mb-4">
                {t(
                  "IGPSO (International Government & Public Supportive Organization) skill development, practical business education, social development और employment readiness की दिशा में कार्य करता है। यह संस्थान युवाओं को practical business training के माध्यम से career-ready बनाने का प्रयास करता है।",
                  "IGPSO (International Government & Public Supportive Organization) works toward skill development, practical business education, social development and employment readiness. The institution strives to make youth career-ready through practical business training."
                )}
              </p>
              <p className="text-xs text-navy/50 mb-3">Registration No.: C/1077232</p>
              <p className="font-hindi font-semibold text-gold text-sm italic">
                {"\"सबका साथ • सबका विकास • सबका विश्वास\""}
              </p>
            </div>
          </div>
        </section>

        {/* Chairman Message */}
        <section className="py-16 relative">
          <div className="max-w-5xl mx-auto px-4">
            <div className="fade-up bg-white rounded-3xl p-8 md:p-12 border border-gold/10 shadow-lg shadow-navy/5 flex flex-col md:flex-row gap-8 items-center">
              <div className="shrink-0">
                <div className="w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden border-4 border-gold/30 shadow-lg">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400"
                    alt="Chairman"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
                  <Quote className="w-5 h-5 text-gold" />
                  <span className="text-xs font-heading font-bold text-gold uppercase tracking-wider">
                    {t("Chairman's Message", "Chairman's Message")}
                  </span>
                </div>
                <p className="text-navy/80 text-sm md:text-base leading-relaxed italic mb-3">
                  {t(
                    "\"हमारा उद्देश्य है कि प्रत्येक विद्यार्थी को व्यावहारिक business knowledge दी जाए ताकि वे industry-ready बनें। किताबी ज्ञान के साथ-साथ practical exposure ही सफलता की कुंजी है।\"",
                    "\"Our aim is to provide every student with practical business knowledge so they become industry-ready. Along with theoretical knowledge, practical exposure is the key to success.\""
                  )}
                </p>
                <p className="font-heading font-bold text-navy text-sm">— {t("IGPSO संस्थापक", "IGPSO Founder")}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Why This Program */}
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="font-heading font-bold text-navy text-2xl md:text-3xl text-center mb-3 fade-up">
              {t("यह Program क्यों चुनें?", "Why This Program?")}
            </h2>
            <p className="text-navy/60 text-sm text-center mb-10 max-w-2xl mx-auto">
              {t("Practical skills जो आपको job market में अलग बनाएं", "Practical skills that set you apart in the job market")}
            </p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <div className="card-hover fade-up bg-white rounded-3xl p-6 border border-gold/10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gold/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500"></div>
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center mb-4">
                    <Briefcase className="w-5 h-5 text-gold" />
                  </div>
                  <h3 className="font-heading font-bold text-navy text-sm mb-2">
                    {t("व्यावहारिक व्यावसायिक समझ", "Practical Business Understanding")}
                  </h3>
                  <p className="text-xs text-navy/60 leading-relaxed">
                    {t("वास्तविक व्यावसायिक प्रक्रियाओं की व्यावहारिक समझ", "Hands-on understanding of real business processes")}
                  </p>
                </div>
              </div>

              <div className="card-hover fade-up bg-white rounded-3xl p-6 border border-gold/10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gold/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500"></div>
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center mb-4">
                    <Mic className="w-5 h-5 text-gold" />
                  </div>
                  <h3 className="font-heading font-bold text-navy text-sm mb-2">
                    {t("व्यावसायिक संचार", "Professional Communication")}
                  </h3>
                  <p className="text-xs text-navy/60 leading-relaxed">
                    {t("कॉर्पोरेट स्तर के संचार कौशल (Communication Skills)", "Corporate-level communication skills")}
                  </p>
                </div>
              </div>

              <div className="card-hover fade-up bg-white rounded-3xl p-6 border border-gold/10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gold/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500"></div>
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center mb-4">
                    <UserCheck className="w-5 h-5 text-gold" />
                  </div>
                  <h3 className="font-heading font-bold text-navy text-sm mb-2">
                    {t("इंटरव्यू की तैयारी", "Interview Readiness")}
                  </h3>
                  <p className="text-xs text-navy/60 leading-relaxed">
                    {t("इंटरव्यू और कार्यस्थल (Workplace) के लिए सम्पूर्ण तैयारी", "Complete preparation for interviews and workplace")}
                  </p>
                </div>
              </div>

              <div className="card-hover fade-up bg-white rounded-3xl p-6 border border-gold/10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gold/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500"></div>
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center mb-4">
                    <Factory className="w-5 h-5 text-gold" />
                  </div>
                  <h3 className="font-heading font-bold text-navy text-sm mb-2">
                    {t("औद्योगिक अनुभव (Industrial Exposure)", "Industrial Exposure")}
                  </h3>
                  <p className="text-xs text-navy/60 leading-relaxed">
                    {t("वास्तविक औद्योगिक परिवेश में सीधा अनुभव", "Direct exposure in real industry environments")}
                  </p>
                </div>
              </div>

              <div className="card-hover fade-up bg-white rounded-3xl p-6 border border-gold/10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gold/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500"></div>
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center mb-4">
                    <Settings className="w-5 h-5 text-gold" />
                  </div>
                  <h3 className="font-heading font-bold text-navy text-sm mb-2">
                    {t("व्यवसाय प्रक्रिया ज्ञान", "Business Process Knowledge")}
                  </h3>
                  <p className="text-xs text-navy/60 leading-relaxed">
                    {t("एचआर (HR), मार्केटिंग, एक्सपोर्ट और प्रोडक्शन की पूर्ण जानकारी", "Complete knowledge of HR, Marketing, Export, Production")}
                  </p>
                </div>
              </div>

              <div className="card-hover fade-up bg-white rounded-3xl p-6 border border-gold/10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gold/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500"></div>
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center mb-4">
                    <Award className="w-5 h-5 text-gold" />
                  </div>
                  <h3 className="font-heading font-bold text-navy text-sm mb-2">
                    {t("इंटर्नशिप प्रमाण पत्र", "Internship Certificate")}
                  </h3>
                  <p className="text-xs text-navy/60 leading-relaxed">
                    {t("प्रोग्राम सफलतापूर्वक पूरा होने पर प्रमाण पत्र", "Certificate upon successful program completion")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 45-Day Program Timeline */}
        <section id="program" className="py-20 bg-navy relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: "radial-gradient(circle at 2px 2px, rgba(213,165,42,0.3) 1px, transparent 0)",
              backgroundSize: "40px 40px",
            }}
          ></div>
          <div className="max-w-6xl mx-auto px-4 relative z-10">
            <h2 className="font-heading font-bold text-white text-2xl md:text-3xl text-center mb-3 fade-up">
              {t("45-Day Program Journey", "45-Day Program Journey")}
            </h2>
            <p className="text-white/60 text-sm text-center mb-12">
              {t("Structured training जो आपको career-ready बनाए", "Structured training to make you career-ready")}
            </p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="fade-up bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 hover:border-gold/30 transition-all duration-300">
                <p className="text-gold font-heading font-bold text-xs mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 bg-gold/20 rounded-full flex items-center justify-center text-[10px]">1</span> Week 1
                </p>
                <h4 className="text-white font-semibold text-sm">
                  {t("व्यक्तित्व और व्यावसायिक संचार", "Personality & Professional Communication")}
                </h4>
              </div>

              <div className="fade-up bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 hover:border-gold/30 transition-all duration-300">
                <p className="text-gold font-heading font-bold text-xs mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 bg-gold/20 rounded-full flex items-center justify-center text-[10px]">2</span> Week 2
                </p>
                <h4 className="text-white font-semibold text-sm">
                  {t("एचआर (HR), इंटरव्यू और ऑफिस Management", "HR, Interview & Office Management")}
                </h4>
              </div>

              <div className="fade-up bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 hover:border-gold/30 transition-all duration-300">
                <p className="text-gold font-heading font-bold text-xs mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 bg-gold/20 rounded-full flex items-center justify-center text-[10px]">3</span> Week 3
                </p>
                <h4 className="text-white font-semibold text-sm">
                  {t("मार्केटिंग, सेल्स और कस्टमर रिलेशंस", "Marketing, Sales & Customer Relations")}
                </h4>
              </div>

              <div className="fade-up bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 hover:border-gold/30 transition-all duration-300">
                <p className="text-gold font-heading font-bold text-xs mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 bg-gold/20 rounded-full flex items-center justify-center text-[10px]">4</span> Week 4
                </p>
                <h4 className="text-white font-semibold text-sm">
                  {t("एक्सपोर्ट, पूछताछ, कोटेशन और ऑर्डर", "Export, Enquiry, Quotation & Order")}
                </h4>
              </div>

              <div className="fade-up bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 hover:border-gold/30 transition-all duration-300">
                <p className="text-gold font-heading font-bold text-xs mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 bg-gold/20 rounded-full flex items-center justify-center text-[10px]">5</span> Week 5
                </p>
                <h4 className="text-white font-semibold text-sm">
                  {t("पर्चेस, प्रोडक्शन, क्वालिटी और लॉजिस्टिक्स", "Purchase, Production, Quality & Logistics")}
                </h4>
              </div>

              <div className="fade-up bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 hover:border-gold/30 transition-all duration-300">
                <p className="text-gold font-heading font-bold text-xs mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 bg-gold/20 rounded-full flex items-center justify-center text-[10px]">6</span> Week 6
                </p>
                <h4 className="text-white font-semibold text-sm">
                  {t("बिलिंग, डॉक्यूमेंटेशन और व्यावसायिक अभ्यास", "Billing, Documentation & Business Practice")}
                </h4>
              </div>

              <div className="fade-up bg-gold/15 border border-gold/30 rounded-2xl p-5 sm:col-span-2">
                <p className="text-gold font-heading font-bold text-xs mb-2 flex items-center gap-2">
                  <Trophy className="w-3.5 h-3.5" />
                  {t("अंतिम दिन", "Final Days")}
                </p>
                <h4 className="text-white font-semibold text-sm">
                  {t("औद्योगिक अनुभव, समीक्षा और प्रमाणन", "Industrial Exposure, Review & Certification")}
                </h4>
              </div>
            </div>
          </div>
        </section>

        {/* Training Modules */}
        <section id="modules" className="py-20">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="font-heading font-bold text-navy text-2xl md:text-3xl text-center mb-3 fade-up">
              {t("Training Modules", "Training Modules")}
            </h2>
            <p className="text-navy/60 text-sm text-center mb-8">
              {t("विभिन्न business areas की practical training", "Practical training across business areas")}
            </p>

            <div className="flex flex-wrap gap-2 justify-center mb-8">
              {["all", "career", "hr", "marketing", "export", "production", "finance"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setModuleFilter(cat)}
                  className={`text-xs font-semibold px-4 py-2 rounded-full transition-all duration-300 ${
                    moduleFilter === cat
                      ? "bg-navy text-white"
                      : "bg-navy/5 text-navy hover:bg-navy/10"
                  }`}
                >
                  {cat === "all" ? t("सभी", "All") : cat.toUpperCase()}
                </button>
              ))}
            </div>

            <div id="modules-grid" className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredModules.map((m, index) => {
                const meta = catMeta[m.cat] || { color: "text-navy bg-white border-navy/10" };
                return (
                  <div
                    key={index}
                    className="module-card-enter group bg-white rounded-2xl p-5 border border-navy/10 shadow-sm hover:shadow-lg hover:border-gold/30 transition-all duration-300 flex items-start gap-4"
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${meta.color} transition-transform group-hover:scale-110 duration-300`}
                    >
                      {getModuleIcon(m.cat)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className={`inline-block text-[10px] font-bold uppercase tracking-wider mb-1 ${meta.color.split(" ")[0]}`}>
                        {m.cat}
                      </span>
                      <h4 className="text-sm font-bold text-navy leading-snug">
                        {t(m.hi, m.en)}
                      </h4>
                    </div>
                  </div>
                );
              })}
            </div>

            <p className="text-[10px] text-navy/40 text-center mt-6">
              {t(
                "Modules may be updated according to batch plan, faculty availability and training requirements.",
                "Modules may be updated according to batch plan, faculty availability and training requirements."
              )}
            </p>
          </div>
        </section>

        {/* Industrial Exposure */}
        <section id="industrial" className="py-20 bg-white relative overflow-hidden">
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-gold/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
          <div className="max-w-6xl mx-auto px-4 relative z-10">
            <h2 className="font-heading font-bold text-navy text-2xl md:text-3xl text-center mb-3 fade-up">
              {t("Classroom से Industry तक", "From Classroom to Industry")}
            </h2>
            <p className="text-navy/60 text-sm text-center mb-10 max-w-2xl mx-auto">
              {t(
                "Students को production, purchase, quality, packing, dispatch, sales और industrial working environments का guided exposure मिल सकता है।",
                "Students may receive guided exposure to production, purchase, quality, packing, dispatch, sales and industrial working environments."
              )}
            </p>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
              <div className="rounded-2xl overflow-hidden fade-up shadow-lg shadow-navy/5 hover:shadow-xl transition-shadow duration-300">
                <img
                  src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=400"
                  alt="Industrial factory"
                  className="w-full h-32 md:h-44 object-cover hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              <div className="rounded-2xl overflow-hidden fade-up shadow-lg shadow-navy/5 hover:shadow-xl transition-shadow duration-300">
                <img
                  src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=400"
                  alt="Quality verification"
                  className="w-full h-32 md:h-44 object-cover hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              <div className="rounded-2xl overflow-hidden fade-up shadow-lg shadow-navy/5 hover:shadow-xl transition-shadow duration-300">
                <img
                  src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=400"
                  alt="Warehouse dispatch"
                  className="w-full h-32 md:h-44 object-cover hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              <div className="rounded-2xl overflow-hidden fade-up shadow-lg shadow-navy/5 hover:shadow-xl transition-shadow duration-300">
                <img
                  src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=400"
                  alt="Professional development"
                  className="w-full h-32 md:h-44 object-cover hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              <div className="rounded-2xl overflow-hidden fade-up shadow-lg shadow-navy/5 hover:shadow-xl transition-shadow duration-300">
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=400"
                  alt="Corporate team"
                  className="w-full h-32 md:h-44 object-cover hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
            </div>

            <p className="text-[10px] text-navy/40 text-center">
              {t(
                "Industrial visits are subject to schedule, permissions, safety requirements and availability.",
                "Industrial visits are subject to schedule, permissions, safety requirements and availability."
              )}
            </p>
          </div>
        </section>

        {/* Student Journey */}
        <section className="py-20 relative overflow-hidden">
          <div className="max-w-6xl mx-auto px-4">
            <div className="fade-up grid md:grid-cols-2 gap-10 items-center">
              <div className="order-2 md:order-1">
                <h2 className="font-heading font-bold text-navy text-2xl md:text-3xl mb-4">
                  {t("आपकी Journey: Student से Professional तक", "Your Journey: Student to Professional")}
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-gold font-bold text-xs">1</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-navy">{t("Classroom Learning", "Classroom Learning")}</p>
                      <p className="text-xs text-navy/60">
                        {t("Structured modules से business fundamentals सीखें", "Learn business fundamentals through structured modules")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-gold font-bold text-xs">2</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-navy">{t("Practical Application", "Practical Application")}</p>
                      <p className="text-xs text-navy/60">
                        {t("Real business scenarios में hands-on practice", "Hands-on practice in real business scenarios")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-gold font-bold text-xs">3</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-navy">{t("Industrial Exposure", "Industrial Exposure")}</p>
                      <p className="text-xs text-navy/60">
                        {t("Real factory और office environments में visit", "Visits to real factory and office environments")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-4 h-4 text-navy" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-navy">{t("Career Ready", "Career Ready")}</p>
                      <p className="text-xs text-navy/60">
                        {t("Certificate के साथ job market के लिए तैयार", "Ready for the job market with certificate")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="order-1 md:order-2 rounded-3xl overflow-hidden shadow-2xl shadow-navy/10">
                <img
                  src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=600"
                  alt="Student journey"
                  className="w-full h-72 md:h-96 object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Who Can Apply */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="font-heading font-bold text-navy text-2xl md:text-3xl text-center mb-8 fade-up">
              {t("कौन Apply कर सकता है?", "Who Can Apply?")}
            </h2>
            <div className="flex flex-wrap gap-3 justify-center mb-6">
              {["BBA", "B.Com", "BA", "BCA", "B.Sc", "B.E./B.Tech", "MBA", "M.Com", "MA", "MSW", "M.Sc"].map((qual) => (
                <span
                  key={qual}
                  className="bg-white border border-gold/20 rounded-full px-4 py-2 text-sm font-medium text-navy shadow-sm hover:shadow-md hover:border-gold/40 transition-all duration-300"
                >
                  {qual}
                </span>
              ))}
              <span className="bg-white border border-gold/20 rounded-full px-4 py-2 text-sm font-medium text-navy shadow-sm hover:shadow-md hover:border-gold/40 transition-all duration-300">
                {t("अन्य Graduates", "Other Graduates")}
              </span>
            </div>
            <p className="text-xs text-navy/50 text-center">
              {t(
                "Eligibility और batch suitability counselling के दौरान confirm की जाएगी।",
                "Eligibility and batch suitability will be confirmed during counselling."
              )}
            </p>
          </div>
        </section>

        {/* Projects */}
        <section id="projects" className="py-20 bg-navy relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: "radial-gradient(circle at 2px 2px, rgba(213,165,42,0.4) 1px, transparent 0)",
              backgroundSize: "50px 50px",
            }}
          ></div>
          <div className="max-w-6xl mx-auto px-4 relative z-10">
            <h2 className="font-heading font-bold text-white text-2xl md:text-3xl text-center mb-2 fade-up">
              {t("Concept, Planning & Design Initiatives", "Concept, Planning & Design Initiatives")}
            </h2>
            <p className="text-white/50 text-xs text-center mb-10">
              {t("10 Smart-City Project Concepts", "10 Smart-City Project Concepts")}
            </p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                "Bus Rapid Transit System",
                "River Travelling Project",
                "Water Harvesting Project",
                "Drinking Water Project",
                "City Road Construction",
                "Railway Crossing Road",
                "City Police Project",
                "Goods Transportation Project",
                "Street-Light Camera Project",
                "Education Project",
              ].map((proj, idx) => (
                <div
                  key={proj}
                  className="fade-up bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center gap-4 hover:bg-white/10 hover:border-gold/30 transition-all duration-300"
                >
                  <span className="text-gold font-heading font-bold text-xl">{(idx + 1).toString().padStart(2, "0")}</span>
                  <p className="text-white text-sm">{proj}</p>
                </div>
              ))}
            </div>

            <p className="text-[10px] text-white/30 text-center mt-6">
              {t(
                "These are concept and planning initiatives. They do not imply government approval, implementation or official partnership unless documentary proof is provided.",
                "These are concept and planning initiatives. They do not imply government approval, implementation or official partnership unless documentary proof is provided."
              )}
            </p>
          </div>
        </section>

        {/* Organization Divisions */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="font-heading font-bold text-navy text-2xl md:text-3xl text-center mb-8 fade-up">
              {t("Organization Divisions", "Organization Divisions")}
            </h2>

            <div className="space-y-3" id="divisions-accordion">
              {divisions.map((div, idx) => {
                const isOpen = !!openDivisions[idx];
                return (
                  <div
                    key={idx}
                    className="acc-item border border-navy/10 rounded-2xl overflow-hidden hover:border-gold/20 transition-colors duration-300"
                  >
                    <button
                      onClick={() => setOpenDivisions((prev) => ({ ...prev, [idx]: !prev[idx] }))}
                      className="acc-btn w-full text-left px-5 py-4 font-heading font-semibold text-sm text-navy flex justify-between items-center"
                    >
                      {div.title}
                      <ChevronDown className="w-4 h-4 transition-transform duration-300" style={{ transform: isOpen ? "rotate(180deg)" : "" }} />
                    </button>
                    <div className={`accordion-content px-5 pb-4 ${isOpen ? "open" : ""}`}>
                      <p className="text-xs text-navy/60">{t(div.contentHi, div.contentEn)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Expansion Vision */}
        <section className="py-16 bg-white">
          <div className="max-w-5xl mx-auto px-4 text-center">
            <h2 className="font-heading font-bold text-navy text-2xl md:text-3xl mb-3 fade-up">
              {t("भारत के 25+ शहरों तक पहुँचने का विज़न", "Vision to Reach 25+ Cities Across India")}
            </h2>
            <p className="text-navy/60 text-sm mb-8">
              {t("Indore (Head Office) से विस्तार का लक्ष्य", "Expansion target from Indore (Head Office)")}
            </p>

            <div className="flex flex-wrap gap-2 justify-center mb-6">
              <span className="bg-gold/15 text-navy text-xs font-bold px-3 py-1.5 rounded-full border border-gold/30 shadow-sm">
                Indore ★
              </span>
              {[
                "Bhopal",
                "Jabalpur",
                "Gwalior",
                "Raipur",
                "Jaipur",
                "Kota",
                "Surat",
                "Vadodara",
                "Pune",
                "Nagpur",
                "Lucknow",
                "Kanpur",
                "Kolkata",
                "Chennai",
                "Hyderabad",
                "Patna",
                "Jammu",
              ].map((city) => (
                <span key={city} className="bg-navy/5 text-navy text-xs px-3 py-1.5 rounded-full hover:bg-navy/10 transition">
                  {city}
                </span>
              ))}
            </div>

            <p className="text-[10px] text-navy/40">
              {t(
                "Locations shown represent a proposed expansion vision and not necessarily operational branches.",
                "Locations shown represent a proposed expansion vision and not necessarily operational branches."
              )}
            </p>
          </div>
        </section>

        {/* Admissions */}
        <section id="admissions" className="py-20 relative">
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="font-heading font-bold text-navy text-2xl md:text-3xl text-center mb-12 fade-up">
              {t("Admission Process", "Admission Process")}
            </h2>

            <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8" id="admission-steps-container">
              {[
                {
                  step: 1,
                  titleHi: "पूछताछ सबमिट करें",
                  titleEn: "Submit Enquiry",
                  descHi: "ऑनलाइन फॉर्म भरें या सीधे हमसे संपर्क करें।",
                  descEn: "Fill out the online form or contact us directly.",
                },
                {
                  step: 2,
                  titleHi: "परामर्श और पात्रता",
                  titleEn: "Counselling & Eligibility",
                  descHi: "हमारे काउंसलर से बात करें और अपनी योग्यता की जांच करें।",
                  descEn: "Speak with our counsellor and verify your eligibility.",
                },
                {
                  step: 3,
                  titleHi: "बैच और फीस की पुष्टि",
                  titleEn: "Batch & Fee Confirmation",
                  descHi: "अपने पसंदीदा बैच समय और फीस विवरण की पुष्टि करें।",
                  descEn: "Confirm your preferred batch timing and fee details.",
                },
                {
                  step: 4,
                  titleHi: "दस्तावेज़ जमा करना",
                  titleEn: "Document Submission",
                  descHi: "प्रवेश के लिए आवश्यक शैक्षणिक दस्तावेज जमा करें।",
                  descEn: "Submit the required academic documents for admission.",
                },
                {
                  step: 5,
                  titleHi: "प्रवेश की पुष्टि",
                  titleEn: "Admission Confirmation",
                  descHi: "संस्थान द्वारा आपके प्रवेश की अंतिम पुष्टि प्राप्त करें।",
                  descEn: "Get the final confirmation of your admission from the institute.",
                },
                {
                  step: 6,
                  titleHi: "प्रशिक्षण (Training) शुरू",
                  titleEn: "Training Commences",
                  descHi: "अपना 45-दिवसीय प्रशिक्षण और इंटर्नशिप प्रोग्राम शुरू करें।",
                  descEn: "Start your 45-day training and internship program.",
                },
              ].map((stepObj) => (
                <div
                  key={stepObj.step}
                  className="admission-step relative flex flex-col gap-2 p-6 bg-white border border-gold/10 rounded-2xl transition-all duration-500 opacity-60 scale-95 shadow-sm"
                  data-step={stepObj.step}
                >
                  <span className="step-badge absolute -top-4 left-6 w-8 h-8 rounded-full bg-white border-2 border-navy/20 flex items-center justify-center font-heading font-bold text-xs text-navy/60 transition-all duration-300 z-10">
                    {stepObj.step}
                  </span>
                  <div className="mt-2">
                    <h4 className="text-sm font-bold text-navy mb-1">{t(stepObj.titleHi, stepObj.titleEn)}</h4>
                    <p className="text-xs text-navy/60">{t(stepObj.descHi, stepObj.descEn)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="font-heading font-bold text-navy text-2xl md:text-3xl text-center mb-10 fade-up">
              {t("अक्सर पूछे जाने वाले प्रश्न", "Frequently Asked Questions")}
            </h2>

            <div className="space-y-3" id="faq-accordion">
              {faqs.map((faq, idx) => {
                const isOpen = !!openFaqs[idx];
                return (
                  <div
                    key={idx}
                    className="acc-item border border-navy/10 rounded-2xl overflow-hidden hover:border-gold/20 transition-colors"
                  >
                    <button
                      onClick={() => setOpenFaqs((prev) => ({ ...prev, [idx]: !prev[idx] }))}
                      className="acc-btn w-full text-left px-5 py-4 font-semibold text-sm text-navy flex justify-between items-center"
                    >
                      <span>{t(faq.qHi, faq.qEn)}</span>
                      <ChevronDown className="w-4 h-4 transition-transform duration-300" style={{ transform: isOpen ? "rotate(180deg)" : "" }} />
                    </button>
                    <div className={`accordion-content px-5 pb-4 ${isOpen ? "open" : ""}`}>
                      <p className="text-xs text-navy/60">{t(faq.aHi, faq.aEn)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-24 bg-navy relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-10"
            style={{ background: "radial-gradient(ellipse at center, rgba(213,165,42,0.3) 0%, transparent 70%)" }}
          ></div>
          <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
            <h2 className="font-hindi font-bold text-white text-2xl md:text-3xl mb-6">
              {t("क्या आप अपने करियर की शुरुआत करने के लिए तैयार हैं?", "Ready to Start Your Career Journey?")}
            </h2>

            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={() => setEnquiryModalOpen(true)}
                className="bg-gold text-navy font-heading font-bold px-7 py-3.5 rounded-full text-sm hover:bg-yellow-400 transition-all duration-300 gold-glow shadow-lg"
              >
                {t("Apply for Admission", "Apply for Admission")}
              </button>
              <a
                href="https://wa.me/919826444482"
                target="_blank"
                rel="noopener noreferrer"
                className="border-2 border-white text-white font-heading font-semibold px-7 py-3.5 rounded-full text-sm hover:bg-white hover:text-navy transition-all duration-300"
              >
                {t("WhatsApp पर बात करें", "Chat on WhatsApp")}
              </a>
              <a
                href="tel:+919826444482"
                className="border-2 border-gold text-gold font-heading font-semibold px-7 py-3.5 rounded-full text-sm hover:bg-gold hover:text-navy transition-all duration-300"
              >
                {t("Call Counsellor", "Call Counsellor")}
              </a>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="py-20">
          <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-12">
            <div className="fade-up">
              <h2 className="font-heading font-bold text-navy text-2xl mb-4">{t("संपर्क करें", "Contact Us")}</h2>
              <div className="space-y-3 text-sm text-navy/75">
                <p>
                  <strong>IGPSO Internship &amp; Business Training College</strong>
                  <br />
                  Plot No. 13/B, Sector-B, Industrial Area, Sanwer Road,
                  <br />
                  Near International Rubber Industries,
                  <br />
                  Indore, Madhya Pradesh – 452015
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5" />
                  <a href="tel:+919826444482">98264-44482</a> | <a href="tel:+919407413082">94074-13082</a>
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5" />
                  igpso2017@yahoo.com
                </p>
                <p className="flex items-center gap-2">
                  <Globe className="w-3.5 h-3.5" />
                  www.igpso.com
                </p>
              </div>

              <div className="mt-6 bg-navy/5 rounded-2xl h-48 flex items-center justify-center text-navy/30 text-sm border border-navy/10">
                {t("Google Map Placeholder", "Google Map Placeholder")}
              </div>
            </div>

            <div className="fade-up">
              <h3 className="font-heading font-bold text-navy text-lg mb-4">{t("Quick Message", "Quick Message")}</h3>
              <form onSubmit={handleContactSubmit} className="grid gap-3">
                <input
                  type="text"
                  required
                  placeholder="Name"
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  className="w-full border border-navy/15 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-gold focus:border-gold outline-none transition"
                />
                <input
                  type="tel"
                  required
                  placeholder="Mobile"
                  value={contactForm.mobile}
                  onChange={(e) => setContactForm({ ...contactForm, mobile: e.target.value })}
                  className="w-full border border-navy/15 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-gold focus:border-gold outline-none transition"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  className="w-full border border-navy/15 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-gold focus:border-gold outline-none transition"
                />
                <textarea
                  rows={3}
                  placeholder="Message"
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  className="w-full border border-navy/15 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-gold focus:border-gold outline-none resize-none transition"
                ></textarea>
                <button
                  type="submit"
                  className="w-full bg-navy text-white font-heading font-bold py-3 rounded-xl hover:bg-royal transition-all duration-300 text-sm"
                >
                  {t("Send Message", "Send Message")}
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-navy text-white py-12">
        <div className="max-w-6xl mx-auto px-4 grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center font-heading font-bold text-navy text-xs">
                IG
              </div>
              <span className="font-heading font-bold text-sm">IGPSO</span>
            </div>
            <p className="text-xs text-white/60 leading-relaxed">
              International Government &amp; Public Supportive Organization
              <br />
              Reg. No. C/1077232
            </p>
          </div>

          <div>
            <h4 className="font-heading font-bold text-sm mb-3 text-gold">Quick Links</h4>
            <ul className="space-y-1 text-xs text-white/60">
              <li>
                <a href="#about" className="hover:text-gold transition">
                  About
                </a>
              </li>
              <li>
                <a href="#program" className="hover:text-gold transition">
                  45-Day Program
                </a>
              </li>
              <li>
                <a href="#modules" className="hover:text-gold transition">
                  Modules
                </a>
              </li>
              <li>
                <a href="#admissions" className="hover:text-gold transition">
                  Admissions
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-gold transition">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-bold text-sm mb-3 text-gold">Program</h4>
            <ul className="space-y-1 text-xs text-white/60">
              <li>Business Training</li>
              <li>Industrial Exposure</li>
              <li>Internship Certificate</li>
              <li>Career Guidance</li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-bold text-sm mb-3 text-gold">Contact</h4>
            <p className="text-xs text-white/60">
              98264-44482
              <br />
              94074-13082
              <br />
              igpso2017@yahoo.com
              <br />
              Indore, MP – 452015
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 mt-8 pt-6 border-t border-white/10 text-[10px] text-white/40 text-center space-y-1">
          <p>Privacy Policy | Terms &amp; Conditions | Admission &amp; Refund Policy | Disclaimer</p>
          <p>
            {t(
              "Training outcomes vary according to attendance, participation, skills and individual performance. Employment or income is not guaranteed.",
              "Training outcomes vary according to attendance, participation, skills and individual performance. Employment or income is not guaranteed."
            )}
          </p>
          <p>© 2026 IGPSO. All Rights Reserved.</p>
        </div>
      </footer>

      {/* WhatsApp Float */}
      <a
        href="https://wa.me/919826444482"
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-float"
        aria-label="Chat on WhatsApp"
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>

      {/* Floating Enquiry Button */}
      <button
        onClick={() => setEnquiryModalOpen(true)}
        className="fixed bottom-24 right-6 z-50 bg-gold text-navy font-heading font-bold text-xs md:text-sm px-5 py-3 rounded-full shadow-lg hover:bg-yellow-400 transition-all duration-300 flex items-center gap-2 border border-gold/20 gold-glow"
      >
        <Edit3 className="w-4 h-4" />
        <span>{t("त्वरित Enquiry", "Quick Enquiry")}</span>
      </button>

      {/* Quick Enquiry Modal */}
      {enquiryModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <div onClick={() => setEnquiryModalOpen(false)} className="absolute inset-0 bg-navy/60 backdrop-blur-md"></div>
          <div className="relative glass-card rounded-3xl p-6 md:p-8 shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto z-10 text-navy">
            <button onClick={() => setEnquiryModalOpen(false)} className="absolute top-4 right-4 text-navy/60 hover:text-navy transition" aria-label="Close modal">
              <X className="w-6 h-6" />
            </button>
            <h2 id="modal-title" className="font-heading font-bold text-navy text-xl mb-1">
              {t("त्वरित पूछताछ", "Quick Enquiry")}
            </h2>
            <p className="text-sm text-navy/60 mb-4">{t("हम आपसे जल्द संपर्क करेंगे", "We'll get back to you soon")}</p>

            <form onSubmit={handleModalSubmit} className={`grid gap-3 ${modalSubmitStatus === "success" ? "hidden" : ""}`}>
              <input
                type="text"
                required
                placeholder="Full Name / पूरा नाम"
                value={modalForm.name}
                onChange={(e) => setModalForm({ ...modalForm, name: e.target.value })}
                className="w-full border border-navy/15 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-gold outline-none bg-white text-navy"
              />
              <input
                type="tel"
                required
                placeholder="Mobile Number"
                value={modalForm.mobile}
                onChange={(e) => setModalForm({ ...modalForm, mobile: e.target.value })}
                className="w-full border border-navy/15 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-gold outline-none bg-white text-navy"
              />

              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="City / शहर"
                  value={modalForm.city}
                  onChange={(e) => setModalForm({ ...modalForm, city: e.target.value })}
                  className="w-full border border-navy/15 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-gold outline-none bg-white text-navy"
                />
                <select
                  value={modalForm.qual}
                  onChange={(e) => setModalForm({ ...modalForm, qual: e.target.value })}
                  className="w-full border border-navy/15 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-gold outline-none bg-white text-navy"
                >
                  <option value="">Qualification</option>
                  {["BBA", "B.Com", "BA", "BCA", "B.Sc", "B.E./B.Tech", "MBA", "M.Com", "MA", "MSW", "M.Sc", "Other"].map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </div>

              <select
                value={modalForm.batch}
                onChange={(e) => setModalForm({ ...modalForm, batch: e.target.value })}
                className="w-full border border-navy/15 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-gold outline-none bg-white text-navy"
              >
                <option value="">Preferred Batch</option>
                <option value="Morning">Morning</option>
                <option value="Afternoon">Afternoon</option>
                <option value="Weekend">Weekend</option>
              </select>

              <textarea
                rows={2}
                placeholder="Message (optional)"
                value={modalForm.msg}
                onChange={(e) => setModalForm({ ...modalForm, msg: e.target.value })}
                className="w-full border border-navy/15 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-gold outline-none resize-none bg-white text-navy"
              ></textarea>

              <label className="flex items-start gap-2 text-xs text-navy/70">
                <input
                  type="checkbox"
                  required
                  checked={modalForm.consent}
                  onChange={(e) => setModalForm({ ...modalForm, consent: e.target.checked })}
                  className="mt-0.5"
                />
                <span>{t("मैं IGPSO को मुझसे संपर्क करने की अनुमति देता/देती हूँ।", "I consent to IGPSO contacting me.")}</span>
              </label>

              <button
                type="submit"
                disabled={modalSubmitStatus === "loading"}
                className="w-full bg-gold text-navy font-heading font-bold py-3 rounded-xl hover:bg-yellow-400 transition text-sm disabled:opacity-50"
              >
                {modalSubmitStatus === "loading" ? "..." : t("कॉल बैक का अनुरोध करें", "Request a Callback")}
              </button>
            </form>

            {modalSubmitStatus === "success" && (
              <div className="text-center py-4">
                <p className="text-success font-semibold">
                  {t("✓ आपकी enquiry सफलतापूर्वक भेजी गई!", "✓ Your enquiry has been submitted!")}
                </p>
              </div>
            )}

            {modalSubmitStatus === "error" && (
              <div className="text-center py-2">
                <p className="text-red-600 text-sm">
                  {t("कुछ गड़बड़ हुई, कृपया पुनः प्रयास करें।", "Something went wrong. Please try again.")}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
