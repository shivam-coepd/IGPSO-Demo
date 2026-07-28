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
  ArrowRight,
  GraduationCap,
  Target,
  Sparkles,
  Building2,
  TrendingUp,
  BookOpen,
  Clock,
  MapPin,
  Send,
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

    // Small delay to ensure DOM is updated after filter changes
    const timer = setTimeout(() => {
      document.querySelectorAll(".fade-up:not(.visible)").forEach((el) => fadeObserver.observe(el));
    }, 50);

    return () => {
      clearTimeout(timer);
      fadeObserver.disconnect();
    };
  }, [moduleFilter]);

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
      const sdk = (window as unknown as { dataSdk?: { create?: (rec: Record<string, unknown>) => Promise<{ isOk: boolean }> } }).dataSdk;
      if (sdk && typeof sdk.create === "function") {
        const res = await sdk.create(record);
        if (res?.isOk) {
          setModalSubmitStatus("success");
        } else {
          setModalSubmitStatus("error");
        }
      } else {
        setModalSubmitStatus("success");
      }
    } catch {
      setModalSubmitStatus("error");
    }

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
      case "career": return <Users className="w-5 h-5" />;
      case "hr": return <Users className="w-5 h-5" />;
      case "marketing": return <Megaphone className="w-5 h-5" />;
      case "export": return <Globe className="w-5 h-5" />;
      case "production": return <Factory className="w-5 h-5" />;
      case "finance": return <Coins className="w-5 h-5" />;
      default: return <Settings className="w-5 h-5" />;
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
    { qHi: "यह program किसके लिए है?", qEn: "Who is this program for?", aHi: "यह program graduates, postgraduates और job seekers के लिए है जो practical business skills सीखना चाहते हैं।", aEn: "This program is for graduates, postgraduates and job seekers who want to learn practical business skills." },
    { qHi: "Program की अवधि कितनी है?", qEn: "What is the program duration?", aHi: "45 दिन का structured internship एवं business training program।", aEn: "45-day structured internship and business training program." },
    { qHi: "क्या industrial visit शामिल है?", qEn: "Is industrial visit included?", aHi: "हाँ, schedule और availability के अनुसार industrial exposure दिया जाता है।", aEn: "Yes, industrial exposure is provided subject to schedule and availability." },
    { qHi: "क्या certificate दिया जाएगा?", qEn: "Will a certificate be provided?", aHi: "हाँ, program पूरा होने पर internship certificate प्रदान किया जाता है।", aEn: "Yes, an internship certificate is provided upon program completion." },
    { qHi: "Training Hindi या English में होगी?", qEn: "Will training be in Hindi or English?", aHi: "Training primarily Hindi में होती है, English communication भी सिखाई जाती है।", aEn: "Training is primarily in Hindi; English communication is also taught." },
    { qHi: "Admission process क्या है?", qEn: "What is the admission process?", aHi: "Enquiry → Counselling → Batch confirmation → Documents → Admission → Training start", aEn: "Enquiry → Counselling → Batch confirmation → Documents → Admission → Training start" },
    { qHi: "क्या placement assistance उपलब्ध है?", qEn: "Is placement assistance available?", aHi: "संस्थान career guidance और placement-related assistance दे सकता है; employment किसी employer की selection process, vacancy, skills और candidate performance पर निर्भर करेगा।", aEn: "The institute can provide career guidance and placement-related assistance; employment depends on employer selection process, vacancy, skills and candidate performance." },
    { qHi: "Fees और batch timings कैसे जानें?", qEn: "How to know fees and batch timings?", aHi: "Enquiry form भरें या counsellor से संपर्क करें।", aEn: "Fill the enquiry form or contact the counsellor." },
    { qHi: "क्या बाहर के विद्यार्थी apply कर सकते हैं?", qEn: "Can outstation students apply?", aHi: "हाँ, किसी भी शहर के students apply कर सकते हैं।", aEn: "Yes, students from any city can apply." },
  ];

  return (
    <div className={`min-h-screen ${lang === "en" ? "lang-en" : ""}`} style={{ backgroundColor: '#FAFAFA', color: '#0A1628' }}>
      {/* Skip Link */}
      <a href="#main-content" className="skip-link">Skip to main content</a>

      {/* Premium Header */}
      <header
        id="site-header"
        className={`header ${scrolled ? "header-solid" : "header-transparent"}`}
      >
        <div className="container">
          <nav className="flex items-center justify-between h-20">
            {/* Logo */}
            <a href="#home" className="logo">
              <div className="logo-icon">IG</div>
              <span className="logo-text hidden sm:block">IGPSO</span>
            </a>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              <a href="#home" className="nav-link">{t("होम", "Home")}</a>
              <a href="#about" className="nav-link">{t("परिचय", "About")}</a>
              <a href="#program" className="nav-link">{t("45-दिवसीय प्रोग्राम", "45-Day Program")}</a>
              <a href="#modules" className="nav-link">{t("मॉड्यूल", "Modules")}</a>
              <a href="#industrial" className="nav-link">{t("औद्योगिक अनुभव", "Industrial")}</a>
              <a href="#projects" className="nav-link">{t("प्रोजेक्ट्स", "Projects")}</a>
              <a href="#admissions" className="nav-link">{t("प्रवेश", "Admissions")}</a>
              <a href="#contact" className="nav-link">{t("संपर्क", "Contact")}</a>
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-4">
              <button onClick={toggleLanguage} className="lang-toggle">
                हि | En
              </button>
              <button
                onClick={() => setEnquiryModalOpen(true)}
                className="btn btn-primary hidden sm:flex"
              >
                Apply Now <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden text-white p-2"
                aria-label="Toggle menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${mobileMenuOpen ? "open" : ""}`}>
        <button
          onClick={() => setMobileMenuOpen(false)}
          className="absolute top-6 right-6 text-white p-2"
          aria-label="Close menu"
        >
          <X className="w-6 h-6" />
        </button>
        <a href="#home" onClick={() => setMobileMenuOpen(false)} className="mobile-menu-link">{t("होम", "Home")}</a>
        <a href="#about" onClick={() => setMobileMenuOpen(false)} className="mobile-menu-link">{t("परिचय", "About")}</a>
        <a href="#program" onClick={() => setMobileMenuOpen(false)} className="mobile-menu-link">{t("45-दिवसीय प्रोग्राम", "45-Day Program")}</a>
        <a href="#modules" onClick={() => setMobileMenuOpen(false)} className="mobile-menu-link">{t("मॉड्यूल", "Modules")}</a>
        <a href="#industrial" onClick={() => setMobileMenuOpen(false)} className="mobile-menu-link">{t("औद्योगिक अनुभव", "Industrial")}</a>
        <a href="#projects" onClick={() => setMobileMenuOpen(false)} className="mobile-menu-link">{t("प्रोजेक्ट्स", "Projects")}</a>
        <a href="#admissions" onClick={() => setMobileMenuOpen(false)} className="mobile-menu-link">{t("प्रवेश", "Admissions")}</a>
        <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="mobile-menu-link">{t("संपर्क", "Contact")}</a>
        <div className="mt-8">
          <button onClick={() => { setMobileMenuOpen(false); setEnquiryModalOpen(true); }} className="btn btn-primary w-full">
            Apply Now <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <main id="main-content">
        {/* Premium Hero Section */}
        <section id="home" className="hero">
          <div className="hero-bg">
            <div className={`hero-slide ${activeSlide === 0 ? "active" : ""}`}>
              <img src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1920" alt="Business training" loading="eager" />
            </div>
            <div className={`hero-slide ${activeSlide === 1 ? "active" : ""}`}>
              <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1920" alt="Student seminar" loading="lazy" />
            </div>
            <div className={`hero-slide ${activeSlide === 2 ? "active" : ""}`}>
              <img src="https://images.unsplash.com/photo-1542744094-3a31f103e35f?auto=format&fit=crop&q=80&w=1920" alt="Practical exposure" loading="lazy" />
            </div>
          </div>
          <div className="hero-overlay"></div>
          <div className="hero-pattern"></div>

          <div className="hero-content">
            <div className="hero-overline fade-up">
              <span className="hero-badge"></span>
              <span className="text-overline" style={{ color: '#E8D48A' }}>
                {t("45-दिवसीय व्यावहारिक व्यावसायिक प्रशिक्षण एवं इंटर्नशिप", "45-DAY BUSINESS TRAINING & INTERNSHIP")}
              </span>
            </div>

            <h1 className="text-hero hero-title fade-up delay-1">
              {t("क्लासरूम और कॉर्पोरेट जगत के बीच की दूरी को मिटाएं", "Bridge the Gap Between Classroom and Corporate World")}
            </h1>

            <p className="hero-subtitle fade-up delay-2">
              {t(
                "IGPSO इंदौर के साथ कम्युनिकेशन, एचआर, मार्केटिंग, एक्सपोर्ट, प्रोडक्शन और लॉजिस्टिक्स में व्यावहारिक अनुभव प्राप्त करें। जॉब मार्केट में सफल होने के लिए तैयार रहें।",
                "Gain practical experience in Communication, HR, Marketing, Export, Production, and Logistics with IGPSO Indore. Get ready to stand out in the job market."
              )}
            </p>

            <div className="hero-buttons fade-up delay-3">
              <button onClick={() => setEnquiryModalOpen(true)} className="btn btn-primary btn-lg">
                {t("अभी आवेदन करें", "Apply Now")} <ArrowRight className="w-5 h-5" />
              </button>
              <a href="#program" className="btn btn-secondary btn-lg">
                {t("प्रोग्राम जानें", "Explore Program")}
              </a>
            </div>

            <div className="hero-tags fade-up delay-4">
              <span className="hero-tag">
                <Calendar className="w-4 h-4" />
                {t("45 दिन Practical Training", "45 Days Practical Training")}
              </span>
              <span className="hero-tag">
                <Factory className="w-4 h-4" />
                {t("Industrial Exposure", "Industrial Exposure")}
              </span>
              <span className="hero-tag">
                <Award className="w-4 h-4" />
                {t("Internship Certificate", "Internship Certificate")}
              </span>
            </div>
          </div>

          <div className="scroll-indicator">
            <ChevronsDown className="w-8 h-8 text-white" />
          </div>
        </section>

        {/* Premium Trust Strip */}
        <section className="section-sm" style={{ backgroundColor: 'white' }}>
          <div className="container">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-center">
              <div className="fade-up">
                <p className="stat-number">
                  <CounterItem target={45} isTriggered={!!triggeredCounters["days"]} />
                </p>
                <p className="stat-label">{t("दिन Training", "Days Training")}</p>
              </div>
              <div className="fade-up delay-1">
                <p className="stat-number">
                  40< span style={{ fontSize: '1.5rem' }}>+</span>
                </p>
                <p className="stat-label">{t("40+ Business Topics", "40+ Business Topics")}</p>
              </div>
              <div className="fade-up delay-2">
                <p className="stat-number">
                  <Check className="w-10 h-10" style={{ color: '#C9A227' }} />
                </p>
                <p className="stat-label">{t("Industrial Exposure", "Industrial Exposure")}</p>
              </div>
              <div className="fade-up delay-3">
                <p className="stat-number">
                  <CounterItem target={10} isTriggered={!!triggeredCounters["concepts"]} />
                </p>
                <p className="stat-label">{t("Smart City Concepts", "Smart City Concepts")}</p>
              </div>
              <div className="fade-up delay-4">
                <p className="stat-number">25+</p>
                <p className="stat-label">{t("शहरों का विज़न", "Cities Vision")}</p>
              </div>
            </div>
            <p className="text-center text-sm mt-8" style={{ color: 'rgba(10, 22, 40, 0.4)' }}>
              {t("Expansion figures represent the organization's stated future vision.", "Expansion figures represent the organization's stated future vision.")}
            </p>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="section" style={{ backgroundColor: '#F8F6F0' }}>
          <div className="container">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div className="fade-up">
                <div className="img-premium" style={{ aspectRatio: '4/3' }}>
                  <img src="https://images.unsplash.com/photo-1531538606174-0f90ff5dce83?auto=format&fit=crop&q=80&w=800" alt="About IGPSO" loading="lazy" />
                </div>
              </div>
              <div className="fade-up delay-1">
                <span className="section-overline">
                  <Sparkles className="w-4 h-4" />
                  {t("हमारे बारे में", "About Us")}
                </span>
                <h2 className="text-section-title mb-6">
                  {t("IGPSO इंदौर के बारे में", "About IGPSO Indore")}
                </h2>
                <p className="text-body mb-6" style={{ color: '#475569' }}>
                  {t(
                    "IGPSO (International Government & Public Supportive Organization) skill development, practical business education, social development और employment readiness की दिशा में कार्य करता है। यह संस्थान युवाओं को practical business training के माध्यम से career-ready बनाने का प्रयास करता है।",
                    "IGPSO (International Government & Public Supportive Organization) works toward skill development, practical business education, social development and employment readiness. The institution strives to make youth career-ready through practical business training."
                  )}
                </p>
                <p className="text-sm mb-6" style={{ color: 'rgba(10, 22, 40, 0.5)' }}>Registration No.: C/1077232</p>
                <div className="p-6 rounded-2xl" style={{ backgroundColor: 'rgba(201, 162, 39, 0.1)', borderLeft: '4px solid #C9A227' }}>
                  <p className="hindi-text text-lg font-semibold" style={{ color: '#9A7B1A' }}>
                    "सबका साथ • सबका विकास • सबका विश्वास"
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Chairman Message */}
        <section className="section-sm" style={{ backgroundColor: 'white' }}>
          <div className="container-sm">
            <div className="quote-card fade-up">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="quote-avatar shrink-0">
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200" alt="Chairman" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Quote className="w-6 h-6" style={{ color: '#C9A227' }} />
                    <span className="text-overline" style={{ color: '#C9A227' }}>
                      {t("Chairman's Message", "Chairman's Message")}
                    </span>
                  </div>
                  <p className="text-lg mb-4 italic" style={{ color: '#475569', lineHeight: '1.8' }}>
                    {t(
                      "\"हमारा उद्देश्य है कि प्रत्येक विद्यार्थी को व्यावहारिक business knowledge दी जाए ताकि वे industry-ready बनें। किताबी ज्ञान के साथ-साथ practical exposure ही सफलता की कुंजी है।\"",
                      "\"Our aim is to provide every student with practical business knowledge so they become industry-ready. Along with theoretical knowledge, practical exposure is the key to success.\""
                    )}
                  </p>
                  <p className="font-heading font-bold" style={{ color: '#0A1628' }}>
                    — {t("IGPSO संस्थापक", "IGPSO Founder")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why This Program */}
        <section className="section" style={{ backgroundColor: '#FAFAFA' }}>
          <div className="container">
            <div className="section-header fade-up">
              <span className="section-overline">
                <Target className="w-4 h-4" />
                {t("हमारी विशेषताएं", "Why Choose Us")}
              </span>
              <h2 className="text-section-title">{t("यह Program क्यों चुनें?", "Why This Program?")}</h2>
              <p className="section-subtitle">
                {t("Practical skills जो आपको job market में अलग बनाएं", "Practical skills that set you apart in the job market")}
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: Briefcase, titleHi: "व्यावहारिक व्यावसायिक समझ", titleEn: "Practical Business Understanding", descHi: "वास्तविक व्यावसायिक प्रक्रियाओं की व्यावहारिक समझ", descEn: "Hands-on understanding of real business processes" },
                { icon: Mic, titleHi: "व्यावसायिक संचार", titleEn: "Professional Communication", descHi: "कॉर्पोरेट स्तर के संचार कौशल", descEn: "Corporate-level communication skills" },
                { icon: UserCheck, titleHi: "इंटरव्यू की तैयारी", titleEn: "Interview Readiness", descHi: "इंटरव्यू और कार्यस्थल के लिए सम्पूर्ण तैयारी", descEn: "Complete preparation for interviews and workplace" },
                { icon: Factory, titleHi: "औद्योगिक अनुभव", titleEn: "Industrial Exposure", descHi: "वास्तविक औद्योगिक परिवेश में सीधा अनुभव", descEn: "Direct exposure in real industry environments" },
                { icon: Settings, titleHi: "व्यवसाय प्रक्रिया ज्ञान", titleEn: "Business Process Knowledge", descHi: "एचआर, मार्केटिंग, एक्सपोर्ट और प्रोडक्शन की पूर्ण जानकारी", descEn: "Complete knowledge of HR, Marketing, Export, Production" },
                { icon: Award, titleHi: "इंटर्नशिप प्रमाण पत्र", titleEn: "Internship Certificate", descHi: "प्रोग्राम सफलतापूर्वक पूरा होने पर प्रमाण पत्र", descEn: "Certificate upon successful program completion" },
              ].map((item, idx) => (
                <div key={idx} className="card fade-up" style={{ animationDelay: `${idx * 0.1}s` }}>
                  <div className="card-body">
                    <div className="card-icon mb-4">
                      <item.icon className="w-7 h-7" style={{ color: '#C9A227' }} />
                    </div>
                    <h3 className="text-card-title mb-2">{t(item.titleHi, item.titleEn)}</h3>
                    <p className="text-caption" style={{ color: '#64748B' }}>{t(item.descHi, item.descEn)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 45-Day Program Timeline */}
        <section id="program" className="section section-dark relative overflow-hidden">
          <div className="bg-pattern-dots"></div>
          <div className="container relative z-10">
            <div className="section-header fade-up">
              <span className="section-overline">
                <GraduationCap className="w-4 h-4" />
                {t("प्रोग्राम संरचना", "Program Structure")}
              </span>
              <h2 className="text-section-title">{t("45-Day Program Journey", "45-Day Program Journey")}</h2>
              <p className="section-subtitle">
                {t("Structured training जो आपको career-ready बनाए", "Structured training to make you career-ready")}
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                { week: 1, titleHi: "व्यक्तित्व और व्यावसायिक संचार", titleEn: "Personality & Professional Communication" },
                { week: 2, titleHi: "एचआर, इंटरव्यू और ऑफिस Management", titleEn: "HR, Interview & Office Management" },
                { week: 3, titleHi: "मार्केटिंग, सेल्स और कस्टमर रिलेशंस", titleEn: "Marketing, Sales & Customer Relations" },
                { week: 4, titleHi: "एक्सपोर्ट, पूछताछ, कोटेशन और ऑर्डर", titleEn: "Export, Enquiry, Quotation & Order" },
                { week: 5, titleHi: "पर्चेस, प्रोडक्शन, क्वालिटी और लॉजिस्टिक्स", titleEn: "Purchase, Production, Quality & Logistics" },
                { week: 6, titleHi: "बिलिंग, डॉक्यूमेंटेशन और व्यावसायिक अभ्यास", titleEn: "Billing, Documentation & Business Practice" },
              ].map((item, idx) => (
                <div key={idx} className="card-dark rounded-2xl p-6 fade-up" style={{ animationDelay: `${idx * 0.1}s` }}>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="w-10 h-10 rounded-xl flex items-center justify-center font-bold" style={{ backgroundColor: 'rgba(201, 162, 39, 0.2)', color: '#C9A227' }}>
                      {item.week}
                    </span>
                    <span className="text-sm font-semibold" style={{ color: '#C9A227' }}>Week {item.week}</span>
                  </div>
                  <h4 className="text-white font-semibold">{t(item.titleHi, item.titleEn)}</h4>
                </div>
              ))}
              
              {/* Final Days Card */}
              <div className="card-dark rounded-2xl p-6 sm:col-span-2 fade-up" style={{ backgroundColor: 'rgba(201, 162, 39, 0.1)', borderColor: 'rgba(201, 162, 39, 0.3)' }}>
                <div className="flex items-center gap-3 mb-4">
                  <Trophy className="w-6 h-6" style={{ color: '#C9A227' }} />
                  <span className="text-sm font-semibold" style={{ color: '#C9A227' }}>{t("अंतिम दिन", "Final Days")}</span>
                </div>
                <h4 className="text-white font-semibold">{t("औद्योगिक अनुभव, समीक्षा और प्रमाणन", "Industrial Exposure, Review & Certification")}</h4>
              </div>
            </div>
          </div>
        </section>

        {/* Training Modules */}
        <section id="modules" className="section" style={{ backgroundColor: 'white' }}>
          <div className="container">
            <div className="section-header fade-up">
              <span className="section-overline">
                <BookOpen className="w-4 h-4" />
                {t("प्रशिक्षण मॉड्यूल", "Training Modules")}
              </span>
              <h2 className="text-section-title">{t("Comprehensive Learning Modules", "Comprehensive Learning Modules")}</h2>
              <p className="section-subtitle">
                {t("विभिन्न business areas की practical training", "Practical training across business areas")}
              </p>
            </div>

            <div className="flex flex-wrap gap-3 justify-center mb-10 fade-up">
              {[
                { key: "all", labelHi: "सभी", labelEn: "All" },
                { key: "career", labelHi: "Career", labelEn: "Career" },
                { key: "hr", labelHi: "HR", labelEn: "HR" },
                { key: "marketing", labelHi: "Marketing", labelEn: "Marketing" },
                { key: "export", labelHi: "Export", labelEn: "Export" },
                { key: "production", labelHi: "Production", labelEn: "Production" },
                { key: "finance", labelHi: "Finance", labelEn: "Finance" },
              ].map((item) => (
                <button
                  key={item.key}
                  onClick={() => setModuleFilter(item.key)}
                  className={`tag ${moduleFilter === item.key ? "tag-active" : ""}`}
                >
                  {t(item.labelHi, item.labelEn)}
                </button>
              ))}
            </div>

            <div key={moduleFilter} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredModules.length > 0 ? (
                filteredModules.map((m, index) => {
                  const meta = catMeta[m.cat] || { color: "text-navy bg-white border-navy/10" };
                  return (
                    <div key={`${m.cat}-${index}`} className="card fade-up" style={{ animationDelay: `${index * 0.03}s` }}>
                      <div className="card-body flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${meta.color}`}>
                          {getModuleIcon(m.cat)}
                        </div>
                        <div>
                          <span className={`inline-block text-xs font-bold uppercase tracking-wider mb-1 ${meta.color.split(" ")[0]}`}>
                            {m.cat}
                          </span>
                          <h4 className="font-semibold" style={{ color: '#0A1628' }}>{t(m.hi, m.en)}</h4>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="col-span-full text-center py-12" style={{ color: '#64748B' }}>
                  <p>No modules found for this category.</p>
                </div>
              )}
            </div>

            <p className="text-center text-sm mt-8" style={{ color: 'rgba(10, 22, 40, 0.4)' }}>
              {t("Modules may be updated according to batch plan, faculty availability and training requirements.", "Modules may be updated according to batch plan, faculty availability and training requirements.")}
            </p>
          </div>
        </section>

        {/* Industrial Exposure */}
        <section id="industrial" className="section" style={{ backgroundColor: '#F8F6F0' }}>
          <div className="container">
            <div className="section-header fade-up">
              <span className="section-overline">
                <Building2 className="w-4 h-4" />
                {t("औद्योगिक अनुभव", "Industrial Experience")}
              </span>
              <h2 className="text-section-title">{t("Classroom से Industry तक", "From Classroom to Industry")}</h2>
              <p className="section-subtitle">
                {t("Students को production, purchase, quality, packing, dispatch, sales और industrial working environments का guided exposure मिल सकता है।", "Students may receive guided exposure to production, purchase, quality, packing, dispatch, sales and industrial working environments.")}
              </p>
            </div>

            <div className="gallery-grid fade-up">
              <div className="gallery-item">
                <img src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800" alt="Industrial factory" loading="lazy" />
              </div>
              <div className="gallery-item">
                <img src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=400" alt="Quality verification" loading="lazy" />
              </div>
              <div className="gallery-item">
                <img src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=400" alt="Professional development" loading="lazy" />
              </div>
              <div className="gallery-item">
                <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=400" alt="Corporate team" loading="lazy" />
              </div>
              <div className="gallery-item">
                <img src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=400" alt="Warehouse dispatch" loading="lazy" />
              </div>
            </div>

            <p className="text-center text-sm mt-8" style={{ color: 'rgba(10, 22, 40, 0.4)' }}>
              {t("Industrial visits are subject to schedule, permissions, safety requirements and availability.", "Industrial visits are subject to schedule, permissions, safety requirements and availability.")}
            </p>
          </div>
        </section>

        {/* Student Journey */}
        <section className="section" style={{ backgroundColor: 'white' }}>
          <div className="container">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div className="order-2 md:order-1 fade-up">
                <h2 className="text-section-title mb-6">
                  {t("आपकी Journey: Student से Professional तक", "Your Journey: Student to Professional")}
                </h2>
                <div className="space-y-6">
                  {[
                    { num: 1, titleHi: "Classroom Learning", titleEn: "Classroom Learning", descHi: "Structured modules से business fundamentals सीखें", descEn: "Learn business fundamentals through structured modules" },
                    { num: 2, titleHi: "Practical Application", titleEn: "Practical Application", descHi: "Real business scenarios में hands-on practice", descEn: "Hands-on practice in real business scenarios" },
                    { num: 3, titleHi: "Industrial Exposure", titleEn: "Industrial Exposure", descHi: "Real factory और office environments में visit", descEn: "Visits to real factory and office environments" },
                    { num: 4, titleHi: "Career Ready", titleEn: "Career Ready", descHi: "Certificate के साथ job market के लिए तैयार", descEn: "Ready for the job market with certificate", highlight: true },
                  ].map((item) => (
                    <div key={item.num} className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${item.highlight ? 'bg-gold text-navy' : ''}`} style={{ backgroundColor: item.highlight ? '#C9A227' : 'rgba(201, 162, 39, 0.1)', color: item.highlight ? '#0A1628' : '#C9A227' }}>
                        {item.highlight ? <Check className="w-6 h-6" /> : <span className="font-bold">{item.num}</span>}
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1" style={{ color: '#0A1628' }}>{t(item.titleHi, item.titleEn)}</h4>
                        <p className="text-sm" style={{ color: '#64748B' }}>{t(item.descHi, item.descEn)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="order-1 md:order-2 fade-up delay-1">
                <div className="img-premium" style={{ aspectRatio: '4/3' }}>
                  <img src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=800" alt="Student journey" loading="lazy" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Who Can Apply */}
        <section className="section-sm" style={{ backgroundColor: '#F8F6F0' }}>
          <div className="container">
            <div className="section-header fade-up">
              <span className="section-overline">
                <Users className="w-4 h-4" />
                {t("पात्रता", "Eligibility")}
              </span>
              <h2 className="text-section-title">{t("कौन Apply कर सकता है?", "Who Can Apply?")}</h2>
            </div>

            <div className="flex flex-wrap gap-3 justify-center mb-6 fade-up">
              {["BBA", "B.Com", "BA", "BCA", "B.Sc", "B.E./B.Tech", "MBA", "M.Com", "MA", "MSW", "M.Sc", "Other Graduates"].map((qual) => (
                <span key={qual} className="city-pill">
                  {qual}
                </span>
              ))}
            </div>
            <p className="text-center text-sm fade-up" style={{ color: 'rgba(10, 22, 40, 0.5)' }}>
              {t("Eligibility और batch suitability counselling के दौरान confirm की जाएगी।", "Eligibility and batch suitability will be confirmed during counselling.")}
            </p>
          </div>
        </section>

        {/* Projects */}
        <section id="projects" className="section section-dark relative overflow-hidden">
          <div className="bg-pattern-dots"></div>
          <div className="container relative z-10">
            <div className="section-header fade-up">
              <span className="section-overline">
                <TrendingUp className="w-4 h-4" />
                {t("प्रोजेक्ट्स", "Projects")}
              </span>
              <h2 className="text-section-title">{t("Concept, Planning & Design Initiatives", "Concept, Planning & Design Initiatives")}</h2>
              <p className="section-subtitle">{t("10 Smart-City Project Concepts", "10 Smart-City Project Concepts")}</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
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
                <div key={proj} className="card-dark rounded-2xl p-6 fade-up" style={{ animationDelay: `${idx * 0.05}s` }}>
                  <span className="text-3xl font-bold" style={{ color: 'rgba(201, 162, 39, 0.3)' }}>{(idx + 1).toString().padStart(2, "0")}</span>
                  <p className="text-white font-medium mt-2">{proj}</p>
                </div>
              ))}
            </div>

            <p className="text-center text-sm mt-8" style={{ color: 'rgba(255, 255, 255, 0.3)' }}>
              {t("These are concept and planning initiatives. They do not imply government approval, implementation or official partnership unless documentary proof is provided.", "These are concept and planning initiatives. They do not imply government approval, implementation or official partnership unless documentary proof is provided.")}
            </p>
          </div>
        </section>

        {/* Organization Divisions */}
        <section className="section" style={{ backgroundColor: 'white' }}>
          <div className="container-sm">
            <div className="section-header fade-up">
              <span className="section-overline">
                <Building2 className="w-4 h-4" />
                {t("संगठन विभाग", "Organization")}
              </span>
              <h2 className="text-section-title">{t("Organization Divisions", "Organization Divisions")}</h2>
            </div>

            <div className="space-y-4 fade-up">
              {divisions.map((div, idx) => {
                const isOpen = !!openDivisions[idx];
                return (
                  <div key={idx} className="accordion-item">
                    <button
                      onClick={() => setOpenDivisions((prev) => ({ ...prev, [idx]: !prev[idx] }))}
                      className="accordion-trigger w-full"
                    >
                      <span>{div.title}</span>
                      <span className="accordion-icon">
                        <ChevronDown className="w-5 h-5" />
                      </span>
                    </button>
                    <div className={`accordion-content ${isOpen ? "open" : ""}`}>
                      <div className="accordion-body">{t(div.contentHi, div.contentEn)}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Expansion Vision */}
        <section className="section-sm" style={{ backgroundColor: '#F8F6F0' }}>
          <div className="container">
            <div className="text-center fade-up">
              <span className="section-overline">
                <MapPin className="w-4 h-4" />
                {t("हमारा विज़न", "Our Vision")}
              </span>
              <h2 className="text-section-title mb-4">{t("भारत के 25+ शहरों तक पहुँचने का विज़न", "Vision to Reach 25+ Cities Across India")}</h2>
              <p className="section-subtitle mb-8">
                {t("Indore (Head Office) से विस्तार का लक्ष्य", "Expansion target from Indore (Head Office)")}
              </p>

              <div className="flex flex-wrap gap-3 justify-center mb-6">
                <span className="city-pill city-pill-head">
                  <MapPin className="w-4 h-4" /> Indore ★
                </span>
                {["Bhopal", "Jabalpur", "Gwalior", "Raipur", "Jaipur", "Kota", "Surat", "Vadodara", "Pune", "Nagpur", "Lucknow", "Kanpur", "Kolkata", "Chennai", "Hyderabad", "Patna", "Jammu"].map((city) => (
                  <span key={city} className="city-pill">{city}</span>
                ))}
              </div>

              <p className="text-sm" style={{ color: 'rgba(10, 22, 40, 0.4)' }}>
                {t("Locations shown represent a proposed expansion vision and not necessarily operational branches.", "Locations shown represent a proposed expansion vision and not necessarily operational branches.")}
              </p>
            </div>
          </div>
        </section>

        {/* Admissions */}
        <section id="admissions" className="section" style={{ backgroundColor: 'white' }}>
          <div className="container">
            <div className="section-header fade-up">
              <span className="section-overline">
                <Clock className="w-4 h-4" />
                {t("प्रवेश प्रक्रिया", "Admissions")}
              </span>
              <h2 className="text-section-title">{t("Admission Process", "Admission Process")}</h2>
              <p className="section-subtitle">
                {t("Simple steps to start your journey", "Simple steps to start your journey")}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { step: 1, titleHi: "पूछताछ सबमिट करें", titleEn: "Submit Enquiry", descHi: "ऑनलाइन फॉर्म भरें या सीधे हमसे संपर्क करें।", descEn: "Fill out the online form or contact us directly." },
                { step: 2, titleHi: "परामर्श और पात्रता", titleEn: "Counselling & Eligibility", descHi: "हमारे काउंसलर से बात करें और अपनी योग्यता की जांच करें।", descEn: "Speak with our counsellor and verify your eligibility." },
                { step: 3, titleHi: "बैच और फीस की पुष्टि", titleEn: "Batch & Fee Confirmation", descHi: "अपने पसंदीदा बैच समय और फीस विवरण की पुष्टि करें।", descEn: "Confirm your preferred batch timing and fee details." },
                { step: 4, titleHi: "दस्तावेज़ जमा करना", titleEn: "Document Submission", descHi: "प्रवेश के लिए आवश्यक शैक्षणिक दस्तावेज जमा करें।", descEn: "Submit the required academic documents for admission." },
                { step: 5, titleHi: "प्रवेश की पुष्टि", titleEn: "Admission Confirmation", descHi: "संस्थान द्वारा आपके प्रवेश की अंतिम पुष्टि प्राप्त करें।", descEn: "Get the final confirmation of your admission from the institute." },
                { step: 6, titleHi: "प्रशिक्षण शुरू", titleEn: "Training Commences", descHi: "अपना 45-दिवसीय प्रशिक्षण और इंटर्नशिप प्रोग्राम शुरू करें।", descEn: "Start your 45-day training and internship program." },
              ].map((item, idx) => (
                <div key={item.step} className="step-card fade-up" style={{ animationDelay: `${idx * 0.1}s` }}>
                  <div className="step-number">{item.step}</div>
                  <h4 className="font-semibold mt-2 mb-2" style={{ color: '#0A1628' }}>{t(item.titleHi, item.titleEn)}</h4>
                  <p className="text-sm" style={{ color: '#64748B' }}>{t(item.descHi, item.descEn)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="section" style={{ backgroundColor: '#F8F6F0' }}>
          <div className="container-sm">
            <div className="section-header fade-up">
              <span className="section-overline">
                <BookOpen className="w-4 h-4" />
                {t("सहायता", "Help")}
              </span>
              <h2 className="text-section-title">{t("अक्सर पूछे जाने वाले प्रश्न", "Frequently Asked Questions")}</h2>
            </div>

            <div className="space-y-4 fade-up">
              {faqs.map((faq, idx) => {
                const isOpen = !!openFaqs[idx];
                return (
                  <div key={idx} className="accordion-item">
                    <button
                      onClick={() => setOpenFaqs((prev) => ({ ...prev, [idx]: !prev[idx] }))}
                      className="accordion-trigger w-full"
                    >
                      <span>{t(faq.qHi, faq.qEn)}</span>
                      <span className="accordion-icon">
                        <ChevronDown className="w-5 h-5" />
                      </span>
                    </button>
                    <div className={`accordion-content ${isOpen ? "open" : ""}`}>
                      <div className="accordion-body">{t(faq.aHi, faq.aEn)}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="section-lg section-dark relative overflow-hidden">
          <div className="bg-pattern-grid"></div>
          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <h2 className="text-section-title mb-6 fade-up">
              {t("क्या आप अपने करियर की शुरुआत करने के लिए तैयार हैं?", "Ready to Start Your Career Journey?")}
            </h2>

            <div className="flex flex-wrap gap-4 justify-center fade-up delay-1">
              <button onClick={() => setEnquiryModalOpen(true)} className="btn btn-primary btn-lg">
                {t("Apply for Admission", "Apply for Admission")} <ArrowRight className="w-5 h-5" />
              </button>
              <a href="https://wa.me/919826444482" target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-lg">
                {t("WhatsApp पर बात करें", "Chat on WhatsApp")}
              </a>
              <a href="tel:+919826444482" className="btn btn-lg" style={{ backgroundColor: 'rgba(201, 162, 39, 0.15)', color: '#C9A227', border: '2px solid rgba(201, 162, 39, 0.4)' }}>
                {t("Call Counsellor", "Call Counsellor")}
              </a>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="section" style={{ backgroundColor: 'white' }}>
          <div className="container">
            <div className="grid md:grid-cols-2 gap-16">
              <div className="fade-up">
                <span className="section-overline">
                  <Phone className="w-4 h-4" />
                  {t("संपर्क", "Contact")}
                </span>
                <h2 className="text-section-title mb-6">{t("संपर्क करें", "Contact Us")}</h2>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(201, 162, 39, 0.1)' }}>
                      <Building2 className="w-5 h-5" style={{ color: '#C9A227' }} />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1" style={{ color: '#0A1628' }}>IGPSO Internship & Business Training College</h4>
                      <p className="text-sm" style={{ color: '#64748B' }}>
                        Plot No. 13/B, Sector-B, Industrial Area, Sanwer Road,
                        <br />Near International Rubber Industries,
                        <br />Indore, Madhya Pradesh – 452015
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(201, 162, 39, 0.1)' }}>
                      <Phone className="w-5 h-5" style={{ color: '#C9A227' }} />
                    </div>
                    <div>
                      <p className="text-sm" style={{ color: '#64748B' }}>
                        <a href="tel:+919826444482" className="hover:text-gold transition">98264-44482</a> | <a href="tel:+919407413082" className="hover:text-gold transition">94074-13082</a>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(201, 162, 39, 0.1)' }}>
                      <Mail className="w-5 h-5" style={{ color: '#C9A227' }} />
                    </div>
                    <div>
                      <p className="text-sm" style={{ color: '#64748B' }}>igpso2017@yahoo.com</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl h-56 flex items-center justify-center" style={{ backgroundColor: 'rgba(10, 22, 40, 0.03)', border: '1px solid rgba(10, 22, 40, 0.1)' }}>
                  <p className="text-sm" style={{ color: 'rgba(10, 22, 40, 0.4)' }}>{t("Google Map Placeholder", "Google Map Placeholder")}</p>
                </div>
              </div>

              <div className="fade-up delay-1">
                <h3 className="text-card-title mb-6">{t("Quick Message", "Quick Message")}</h3>
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <input type="text" required placeholder="Name" value={contactForm.name} onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })} className="input" />
                  <input type="tel" required placeholder="Mobile" value={contactForm.mobile} onChange={(e) => setContactForm({ ...contactForm, mobile: e.target.value })} className="input" />
                  <input type="email" placeholder="Email" value={contactForm.email} onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })} className="input" />
                  <textarea rows={4} placeholder="Message" value={contactForm.message} onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })} className="input textarea"></textarea>
                  <button type="submit" className="btn btn-primary w-full">
                    {t("Send Message", "Send Message")} <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Premium Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <a href="#home" className="logo">
                <div className="logo-icon">IG</div>
                <span className="logo-text">IGPSO</span>
              </a>
              <p className="mt-4">
                International Government & Public Supportive Organization
                <br />Registration No. C/1077232
              </p>
            </div>

            <div>
              <h4 className="footer-title">{t("Quick Links", "Quick Links")}</h4>
              <ul className="footer-links">
                <li><a href="#about">{t("About", "About")}</a></li>
                <li><a href="#program">{t("45-Day Program", "45-Day Program")}</a></li>
                <li><a href="#modules">{t("Modules", "Modules")}</a></li>
                <li><a href="#admissions">{t("Admissions", "Admissions")}</a></li>
                <li><a href="#contact">{t("Contact", "Contact")}</a></li>
              </ul>
            </div>

            <div>
              <h4 className="footer-title">{t("Program", "Program")}</h4>
              <ul className="footer-links">
                <li><a href="#program">{t("Business Training", "Business Training")}</a></li>
                <li><a href="#industrial">{t("Industrial Exposure", "Industrial Exposure")}</a></li>
                <li><a href="#admissions">{t("Internship Certificate", "Internship Certificate")}</a></li>
                <li><a href="#contact">{t("Career Guidance", "Career Guidance")}</a></li>
              </ul>
            </div>

            <div>
              <h4 className="footer-title">{t("Contact", "Contact")}</h4>
              <ul className="footer-links">
                <li>98264-44482</li>
                <li>94074-13082</li>
                <li>igpso2017@yahoo.com</li>
                <li>Indore, MP – 452015</li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <p className="mb-2">
              <a href="#" className="hover:text-gold transition mx-2">Privacy Policy</a> |
              <a href="#" className="hover:text-gold transition mx-2">Terms & Conditions</a> |
              <a href="#" className="hover:text-gold transition mx-2">Admission & Refund Policy</a> |
              <a href="#" className="hover:text-gold transition mx-2">Disclaimer</a>
            </p>
            <p className="footer-copyright">
              {t("Training outcomes vary according to attendance, participation, skills and individual performance. Employment or income is not guaranteed.", "Training outcomes vary according to attendance, participation, skills and individual performance. Employment or income is not guaranteed.")}
            </p>
            <p className="footer-copyright mt-2">© 2026 IGPSO. All Rights Reserved.</p>
          </div>
        </div>
      </footer>

      {/* WhatsApp Float */}
      <a href="https://wa.me/919826444482" target="_blank" rel="noopener noreferrer" className="whatsapp-float" aria-label="Chat on WhatsApp">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>

      {/* Floating Enquiry Button */}
      <div className="enquiry-float">
        <button
          onClick={() => setEnquiryModalOpen(true)}
          className="btn btn-primary shadow-gold"
        >
          <Edit3 className="w-4 h-4" />
          <span>{t("त्वरित Enquiry", "Quick Enquiry")}</span>
        </button>
      </div>

      {/* Quick Enquiry Modal */}
      {enquiryModalOpen && (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <div onClick={() => setEnquiryModalOpen(false)} className="absolute inset-0"></div>
          <div className="modal-content">
            <button onClick={() => setEnquiryModalOpen(false)} className="modal-close" aria-label="Close modal">
              <X className="w-5 h-5" />
            </button>
            <h2 id="modal-title" className="text-section-title mb-2">{t("त्वरित पूछताछ", "Quick Enquiry")}</h2>
            <p className="mb-6" style={{ color: '#64748B' }}>{t("हम आपसे जल्द संपर्क करेंगे", "We'll get back to you soon")}</p>

            {modalSubmitStatus !== "success" ? (
              <form onSubmit={handleModalSubmit} className="space-y-4">
                <input type="text" required placeholder="Full Name / पूरा नाम" value={modalForm.name} onChange={(e) => setModalForm({ ...modalForm, name: e.target.value })} className="input" />
                <input type="tel" required placeholder="Mobile Number" value={modalForm.mobile} onChange={(e) => setModalForm({ ...modalForm, mobile: e.target.value })} className="input" />
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" placeholder="City / शहर" value={modalForm.city} onChange={(e) => setModalForm({ ...modalForm, city: e.target.value })} className="input" />
                  <select value={modalForm.qual} onChange={(e) => setModalForm({ ...modalForm, qual: e.target.value })} className="input select">
                    <option value="">Qualification</option>
                    {["BBA", "B.Com", "BA", "BCA", "B.Sc", "B.E./B.Tech", "MBA", "M.Com", "MA", "MSW", "M.Sc", "Other"].map((o) => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </select>
                </div>
                <select value={modalForm.batch} onChange={(e) => setModalForm({ ...modalForm, batch: e.target.value })} className="input select">
                  <option value="">Preferred Batch</option>
                  <option value="Morning">Morning</option>
                  <option value="Afternoon">Afternoon</option>
                  <option value="Weekend">Weekend</option>
                </select>
                <textarea rows={2} placeholder="Message (optional)" value={modalForm.msg} onChange={(e) => setModalForm({ ...modalForm, msg: e.target.value })} className="input textarea"></textarea>
                <label className="flex items-start gap-3 text-sm" style={{ color: '#64748B' }}>
                  <input type="checkbox" required checked={modalForm.consent} onChange={(e) => setModalForm({ ...modalForm, consent: e.target.checked })} className="mt-1" />
                  <span>{t("मैं IGPSO को मुझसे संपर्क करने की अनुमति देता/देती हूँ।", "I consent to IGPSO contacting me.")}</span>
                </label>
                <button type="submit" disabled={modalSubmitStatus === "loading"} className="btn btn-primary w-full">
                  {modalSubmitStatus === "loading" ? "..." : t("कॉल बैक का अनुरोध करें", "Request a Callback")}
                </button>
              </form>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)' }}>
                  <Check className="w-8 h-8" style={{ color: '#22C55E' }} />
                </div>
                <p className="font-semibold text-lg" style={{ color: '#22C55E' }}>
                  {t("✓ आपकी enquiry सफलतापूर्वक भेजी गई!", "✓ Your enquiry has been submitted!")}
                </p>
              </div>
            )}

            {modalSubmitStatus === "error" && (
              <div className="text-center py-4">
                <p style={{ color: '#EF4444' }}>{t("कुछ गड़बड़ हुई, कृपया पुनः प्रयास करें।", "Something went wrong. Please try again.")}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
