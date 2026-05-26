import { useState, useEffect, useRef } from "react";
 
const BRAND  = "#00C47A";
const BRAND2 = "#00A868";
const DARK   = "#070B0F";
const DARK2  = "#0D1117";
const DARK3  = "#161B22";
const DARK4  = "#21262D";
const BORDER = "rgba(255,255,255,0.08)";
const MUTED  = "#8B949E";
const WHITE  = "#F0F6FC";
 
function useInView(threshold = 0.1) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}
 
function FadeIn({ children, delay = 0, style = {} }) {
  const [ref, visible] = useInView();
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "none" : "translateY(28px)",
      transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
      ...style
    }}>
      {children}
    </div>
  );
}
 
function Typewriter({ words }) {
  const [wordIdx, setWordIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [text, setText] = useState("");
  useEffect(() => {
    const word = words[wordIdx];
    const delay = deleting ? 45 : 95;
    const timer = setTimeout(() => {
      if (!deleting) {
        setText(word.slice(0, charIdx + 1));
        if (charIdx + 1 === word.length) setTimeout(() => setDeleting(true), 1800);
        else setCharIdx(c => c + 1);
      } else {
        setText(word.slice(0, charIdx - 1));
        if (charIdx - 1 === 0) {
          setDeleting(false);
          setWordIdx(i => (i + 1) % words.length);
          setCharIdx(0);
        } else setCharIdx(c => c - 1);
      }
    }, delay);
    return () => clearTimeout(timer);
  }, [charIdx, deleting, wordIdx, words]);
  return (
    <span style={{ color: BRAND }}>
      {text}<span style={{ animation: "blink 1s step-end infinite", color: BRAND }}>|</span>
    </span>
  );
}
 
// ── useMediaQuery hook ────────────────────────────────────
function useMedia(query) {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(query);
    setMatches(mq.matches);
    const fn = (e) => setMatches(e.matches);
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, [query]);
  return matches;
}
 
const PLANS = [
  { name: "Starter", monthly: 0, annual: 0, desc: "Perfect for freelancers and solo builders.", color: MUTED,
    features: ["Up to 3 projects", "2 team members", "5GB storage", "Basic analytics", "Email support", "REST API access"],
    missing: ["Custom domains", "Advanced reports", "Priority support", "SSO / SAML"] },
  { name: "Pro", monthly: 29, annual: 23, desc: "Built for growing teams who ship fast.", color: BRAND, popular: true,
    features: ["Unlimited projects", "Up to 20 members", "50GB storage", "Advanced analytics", "Priority support", "REST API + Webhooks", "Custom domains", "Kanban + Gantt views"],
    missing: ["SSO / SAML"] },
  { name: "Enterprise", monthly: 79, annual: 63, desc: "For large orgs that need control at scale.", color: "#A78BFA",
    features: ["Everything in Pro", "Unlimited members", "500GB storage", "Custom reports", "Dedicated CSM", "SSO / SAML", "On-premise option", "SLA guarantee", "Audit logs"],
    missing: [] },
];
 
const FAQS = [
  { q: "Is there a free trial?", a: "Yes — the Starter plan is free forever with no credit card required. Pro and Enterprise plans include a 14-day free trial with full access." },
  { q: "Can I switch plans anytime?", a: "Absolutely. Upgrade, downgrade, or cancel at any time. Billing adjusts automatically at your next cycle." },
  { q: "What stack is FlowSync built on?", a: "FlowSync runs on a full MERN stack — MongoDB for data, Express + Node.js for the API, and React for the frontend. Deployed on AWS with auto-scaling." },
  { q: "Is my data secure?", a: "All data is encrypted at rest (AES-256) and in transit (TLS 1.3). We're SOC 2 Type II certified and GDPR compliant." },
  { q: "Do you offer custom integrations?", a: "Enterprise plans include custom webhook integrations and our REST API supports any MERN, Python, or third-party stack." },
];
 
const TESTIMONIALS = [
  { name: "Sarah Chen", role: "CTO, NovaSpark", avatar: "SC", text: "FlowSync replaced Jira and Notion for us in one shot. The MERN backend is blazing fast — our team spun up 12 projects in under a day." },
  { name: "Marcus Webb", role: "Product Lead, Loopline", avatar: "MW", text: "The Kanban + Gantt view combination is something we've wanted for years. Real-time sync across the team is genuinely flawless." },
  { name: "Priya Nair", role: "Founder, Buildstack", avatar: "PN", text: "Migrated from Asana in 2 hours. The API is clean and well-documented — our devs integrated our CI/CD pipeline in an afternoon." },
];
 
const FEATURES = [
  { icon: "⚡", title: "Real-time sync", desc: "Every update propagates to your entire team in under 80ms via WebSockets. No refresh needed — ever.", tag: "Node.js + Socket.io" },
  { icon: "🗂️", title: "Kanban & Gantt", desc: "Switch between board, list, timeline, and Gantt views with one click. Your data, your preferred layout.", tag: "React DnD" },
  { icon: "🍃", title: "MongoDB-powered", desc: "Flexible document model means your project schema evolves with your workflow — no painful migrations.", tag: "MongoDB Atlas" },
  { icon: "🔗", title: "REST API + Webhooks", desc: "Full REST API with 60+ endpoints. Trigger webhooks on any event — connect to Slack, GitHub, Zapier, or your own pipeline.", tag: "Express.js" },
  { icon: "📊", title: "Analytics dashboard", desc: "Burndown charts, velocity tracking, time-in-status breakdowns. All computed in real-time from your live data.", tag: "Recharts + Aggregation" },
  { icon: "🔒", title: "Role-based access", desc: "Owner, Admin, Member, and Guest roles with granular per-project permissions. SSO via SAML 2.0 on Enterprise.", tag: "JWT + OAuth 2.0" },
];
 
const INTEGRATIONS = [
  { name: "GitHub", cat: "Code" }, { name: "Slack", cat: "Comms" },
  { name: "Figma", cat: "Design" }, { name: "Vercel", cat: "Deploy" },
  { name: "Stripe", cat: "Payments" }, { name: "Jira", cat: "Migration" },
  { name: "Notion", cat: "Docs" }, { name: "Linear", cat: "Issues" },
];
 
const STACK_LAYERS = [
  { layer: "Frontend", tech: "React 18 + Vite", detail: "TypeScript · Tailwind · React Query · Socket.io-client", color: "#61DAFB" },
  { layer: "Backend", tech: "Node.js + Express", detail: "REST API · JWT auth · WebSocket · Rate limiting", color: "#68A063" },
  { layer: "Database", tech: "MongoDB Atlas", detail: "Aggregation pipeline · Change streams · Atlas Search", color: BRAND },
  { layer: "Infra", tech: "AWS + Docker", detail: "EC2 · S3 · CloudFront · Auto-scaling · CI/CD", color: "#FF9900" },
];
 
const NAV_LINKS = ["Features", "Pricing", "Integrations", "Docs"];
 
export default function FlowSync() {
  const [annual, setAnnual] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const [navScrolled, setNavScrolled] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
 
  const isMobile = useMedia("(max-width: 640px)");
  const isTablet = useMedia("(max-width: 900px)");
 
  useEffect(() => {
    const fn = () => setNavScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
 
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileMenu(false);
  };
 
  const px = isMobile ? "16px" : isTablet ? "28px" : "40px";
  const secPad = isMobile ? "64px 16px" : isTablet ? "80px 28px" : "100px 40px";
 
  return (
    <div style={{ background: DARK, color: WHITE, fontFamily: "'Inter','Segoe UI',sans-serif", overflowX: "hidden", minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        ::selection { background: ${BRAND}33; color: ${BRAND}; }
        a { text-decoration: none; color: inherit; }
        button { cursor: pointer; font-family: inherit; }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(36px)} to{opacity:1;transform:none} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes pulse-ring { 0%{box-shadow:0 0 0 0 ${BRAND}44} 100%{box-shadow:0 0 0 14px transparent} }
        .hover-lift { transition: transform 0.25s ease, border-color 0.25s ease; }
        .hover-lift:hover { transform: translateY(-4px); border-color: ${BRAND}55 !important; }
        .btn-primary { background: ${BRAND}; color: #070B0F; border: none; padding: 13px 24px; font-size: 15px; font-weight: 600; border-radius: 8px; transition: all 0.2s; letter-spacing: -0.01em; white-space: nowrap; }
        .btn-primary:hover { background: ${BRAND2}; transform: translateY(-1px); box-shadow: 0 8px 24px ${BRAND}40; }
        .btn-ghost { background: transparent; color: ${WHITE}; border: 1px solid ${BORDER}; padding: 12px 20px; font-size: 14px; font-weight: 500; border-radius: 8px; transition: all 0.2s; white-space: nowrap; }
        .btn-ghost:hover { border-color: ${BRAND}66; background: ${BRAND}0D; }
        .nav-link-btn { color: ${MUTED}; font-size: 14px; font-weight: 400; cursor: pointer; transition: color 0.2s; border: none; background: none; font-family: inherit; padding: 0; }
        .nav-link-btn:hover { color: ${WHITE}; }
        .badge { display: inline-flex; align-items: center; gap: 6px; background: ${BRAND}15; color: ${BRAND}; border: 1px solid ${BRAND}30; padding: 5px 12px; border-radius: 99px; font-size: 12px; font-weight: 500; }
        .feature-card { background: ${DARK3}; border: 1px solid ${BORDER}; border-radius: 12px; padding: 24px; transition: all 0.3s; height: 100%; }
        .feature-card:hover { border-color: ${BRAND}44; background: ${DARK4}; transform: translateY(-3px); }
        .plan-card { background: ${DARK3}; border: 1px solid ${BORDER}; border-radius: 14px; padding: 28px; transition: border-color 0.3s; width: 100%; }
        .plan-popular { border: 2px solid ${BRAND} !important; position: relative; }
        .plan-popular::before { content: "Most Popular"; position: absolute; top: -13px; left: 50%; transform: translateX(-50%); background: ${BRAND}; color: #070B0F; font-size: 11px; font-weight: 700; padding: 3px 12px; border-radius: 99px; letter-spacing: 0.05em; white-space: nowrap; }
        .check { color: ${BRAND}; margin-right: 10px; font-weight: 700; flex-shrink: 0; }
        .cross { color: ${MUTED}44; margin-right: 10px; flex-shrink: 0; }
        .faq-item { border-bottom: 1px solid ${BORDER}; }
        .faq-q { padding: 18px 0; display: flex; justify-content: space-between; align-items: center; cursor: pointer; user-select: none; gap: 12px; }
        .input-field { background: ${DARK3}; border: 1px solid ${BORDER}; color: ${WHITE}; padding: 13px 16px; font-size: 14px; font-family: inherit; border-radius: 8px; outline: none; transition: border-color 0.2s; width: 100%; }
        .input-field:focus { border-color: ${BRAND}66; }
        .input-field::placeholder { color: ${MUTED}; }
        .tag-pill { background: ${DARK4}; color: ${MUTED}; font-size: 10px; font-family: 'JetBrains Mono',monospace; padding: 3px 8px; border-radius: 4px; border: 1px solid ${BORDER}; white-space: nowrap; flex-shrink: 0; }
        .toggle { position: relative; width: 44px; height: 24px; background: ${BORDER}; border-radius: 99px; border: none; cursor: pointer; transition: background 0.2s; flex-shrink: 0; }
        .toggle.on { background: ${BRAND}; }
        .toggle-knob { position: absolute; width: 18px; height: 18px; background: white; border-radius: 50%; top: 3px; left: 3px; transition: left 0.2s; pointer-events: none; }
        .toggle.on .toggle-knob { left: 23px; }
        .avatar { width: 38px; height: 38px; border-radius: 50%; background: ${BRAND}22; border: 1px solid ${BRAND}44; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 600; color: ${BRAND}; flex-shrink: 0; }
        .star { color: #F0C040; font-size: 13px; }
        .section-label { font-size: 11px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: ${BRAND}; margin-bottom: 12px; }
        .section-title { font-size: clamp(24px, 5vw, 42px); font-weight: 700; letter-spacing: -0.03em; color: ${WHITE}; line-height: 1.15; }
        .mono { font-family: 'JetBrains Mono',monospace; }
        .hamburger { display: none; flex-direction: column; gap: 5px; background: none; border: none; padding: 4px; cursor: pointer; }
        .hamburger span { display: block; width: 22px; height: 2px; background: ${WHITE}; border-radius: 2px; transition: all 0.3s; }
        @media (max-width: 900px) {
          .nav-desktop { display: none !important; }
          .hamburger { display: flex !important; }
        }
        @media (min-width: 901px) {
          .mobile-menu { display: none !important; }
        }
      `}</style>
 
      {/* ── NAV ──────────────────────────────────────────────── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
        padding: `0 ${px}`, height: 60,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: (navScrolled || mobileMenu) ? `${DARK}F5` : "transparent",
        backdropFilter: (navScrolled || mobileMenu) ? "blur(16px)" : "none",
        borderBottom: navScrolled ? `1px solid ${BORDER}` : "none",
        transition: "all 0.3s",
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 9, flexShrink: 0 }}>
          <div style={{ width: 30, height: 30, background: BRAND, borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
              <path d="M3 9h5M10 9h5M9 3v5M9 10v5" stroke="#070B0F" strokeWidth="2.2" strokeLinecap="round"/>
            </svg>
          </div>
          <span style={{ fontSize: 16, fontWeight: 700, letterSpacing: "-0.03em", color: WHITE }}>FlowSync</span>
        </div>
 
        {/* Desktop nav */}
        <div className="nav-desktop" style={{ display: "flex", gap: 28, alignItems: "center" }}>
          {NAV_LINKS.map(n => <button key={n} className="nav-link-btn" onClick={() => scrollTo(n.toLowerCase())}>{n}</button>)}
        </div>
 
        {/* Desktop CTAs */}
        <div className="nav-desktop" style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <button className="btn-ghost" style={{ padding: "8px 16px", fontSize: 13 }}>Log in</button>
          <button className="btn-primary" style={{ padding: "8px 18px", fontSize: 13 }}>Start free</button>
        </div>
 
        {/* Hamburger */}
        <button className="hamburger" onClick={() => setMobileMenu(m => !m)} aria-label="Menu">
          <span style={{ transform: mobileMenu ? "rotate(45deg) translate(5px, 5px)" : "none" }} />
          <span style={{ opacity: mobileMenu ? 0 : 1 }} />
          <span style={{ transform: mobileMenu ? "rotate(-45deg) translate(5px, -5px)" : "none" }} />
        </button>
      </nav>
 
      {/* Mobile menu drawer */}
      <div className="mobile-menu" style={{
        position: "fixed", top: 60, left: 0, right: 0, zIndex: 190,
        background: `${DARK2}FA`, backdropFilter: "blur(16px)",
        borderBottom: `1px solid ${BORDER}`,
        padding: "20px 20px 28px",
        display: mobileMenu ? "flex" : "none",
        flexDirection: "column", gap: 4,
        transform: mobileMenu ? "translateY(0)" : "translateY(-100%)",
        transition: "transform 0.3s ease",
      }}>
        {NAV_LINKS.map(n => (
          <button key={n} onClick={() => scrollTo(n.toLowerCase())} style={{ background: "none", border: "none", color: WHITE, fontSize: 16, fontWeight: 500, padding: "12px 0", textAlign: "left", fontFamily: "inherit", cursor: "pointer", borderBottom: `1px solid ${BORDER}` }}>
            {n}
          </button>
        ))}
        <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
          <button className="btn-ghost" style={{ flex: 1 }}>Log in</button>
          <button className="btn-primary" style={{ flex: 1 }}>Start free</button>
        </div>
      </div>
 
      {/* ── HERO ──────────────────────────────────────────────── */}
      <section id="hero" style={{ minHeight: "100vh", display: "flex", alignItems: "center", padding: isMobile ? "90px 16px 60px" : isTablet ? "90px 28px 70px" : "110px 40px 80px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(${BORDER} 1px, transparent 1px), linear-gradient(90deg, ${BORDER} 1px, transparent 1px)`, backgroundSize: "48px 48px", opacity: 0.4, pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "20%", left: "50%", width: "min(800px, 120vw)", height: 500, borderRadius: "50%", background: `radial-gradient(ellipse, ${BRAND}18 0%, transparent 65%)`, transform: "translateX(-50%)", pointerEvents: "none" }} />
 
        <div style={{ maxWidth: 1180, margin: "0 auto", width: "100%", position: "relative" }}>
 
          {/* Hero layout: stacked on mobile, 2-col on desktop */}
          <div style={{ display: "grid", gridTemplateColumns: isTablet ? "1fr" : "1fr 1fr", gap: isTablet ? 40 : 60, alignItems: "center" }}>
 
            {/* LEFT: text */}
            <div>
              <div style={{ opacity: 0, animation: "fadeUp 0.9s ease 0.1s forwards" }}>
                <span className="badge">
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: BRAND, animation: "pulse-ring 1.5s infinite" }} />
                  Now with AI-powered task suggestions
                </span>
              </div>
 
              <h1 style={{ fontSize: isMobile ? "clamp(34px,9vw,46px)" : "clamp(36px,5vw,62px)", fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1.1, margin: "20px 0 18px", opacity: 0, animation: "fadeUp 0.9s ease 0.25s forwards" }}>
                Ship projects<br />
                <Typewriter words={["faster.", "smarter.", "together.", "on time."]} />
              </h1>
 
              <p style={{ fontSize: isMobile ? 15 : 17, color: MUTED, lineHeight: 1.75, maxWidth: 460, marginBottom: 28, fontWeight: 300, opacity: 0, animation: "fadeUp 0.9s ease 0.4s forwards" }}>
                FlowSync is the MERN-powered project management platform that keeps your engineering team in sync — real-time, API-first, and beautifully simple.
              </p>
 
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", opacity: 0, animation: "fadeUp 0.9s ease 0.55s forwards" }}>
                <button className="btn-primary" style={{ fontSize: isMobile ? 14 : 15, padding: isMobile ? "12px 20px" : "13px 28px" }} onClick={() => scrollTo("pricing")}>
                  Start free — no card needed
                </button>
                <button className="btn-ghost" style={{ display: "flex", alignItems: "center", gap: 8, fontSize: isMobile ? 13 : 14 }}>
                  <span style={{ width: 26, height: 26, borderRadius: "50%", border: `2px solid ${BRAND}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ width: 0, height: 0, borderTop: "5px solid transparent", borderBottom: "5px solid transparent", borderLeft: `8px solid ${BRAND}`, marginLeft: 2 }} />
                  </span>
                  Watch demo (2 min)
                </button>
              </div>
 
              {/* Social proof */}
              <div style={{ marginTop: 36, display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap", opacity: 0, animation: "fadeUp 0.9s ease 0.7s forwards" }}>
                <div style={{ display: "flex" }}>
                  {["SC", "MW", "PN", "AJ"].map((init, i) => (
                    <div key={init} style={{ width: 30, height: 30, borderRadius: "50%", background: `${BRAND}22`, border: `2px solid ${DARK}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 600, color: BRAND, marginLeft: i > 0 ? -8 : 0 }}>{init}</div>
                  ))}
                </div>
                <div>
                  <div style={{ display: "flex", gap: 2 }}>{"★★★★★".split("").map((s, i) => <span key={i} className="star">{s}</span>)}</div>
                  <p style={{ fontSize: 12, color: MUTED, marginTop: 2 }}>Loved by <strong style={{ color: WHITE }}>4,200+</strong> engineering teams</p>
                </div>
              </div>
            </div>
 
            {/* RIGHT: App mockup — hidden on mobile, shown on tablet+ */}
            {!isMobile && (
              <FadeIn delay={300}>
                <div style={{ background: DARK2, border: `1px solid ${BORDER}`, borderRadius: 14, overflow: "hidden", animation: "float 5s ease-in-out infinite" }}>
                  {/* Window chrome */}
                  <div style={{ padding: "10px 14px", borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", gap: 7 }}>
                    {["#FF5F57", "#FEBC2E", "#28C840"].map(c => <div key={c} style={{ width: 11, height: 11, borderRadius: "50%", background: c }} />)}
                    <div style={{ flex: 1, background: DARK3, borderRadius: 4, height: 20, display: "flex", alignItems: "center", paddingLeft: 10 }}>
                      <span style={{ fontSize: 10, color: MUTED }} className="mono">app.flowsync.io/dashboard</span>
                    </div>
                  </div>
                  {/* App body */}
                  <div style={{ display: "flex", height: isTablet ? 280 : 320 }}>
                    {/* Sidebar */}
                    <div style={{ width: 46, borderRight: `1px solid ${BORDER}`, padding: "14px 0", display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
                      {["⊞", "◫", "◱", "⊙", "⚙"].map((icon, i) => (
                        <div key={i} style={{ width: 30, height: 30, borderRadius: 6, background: i === 0 ? `${BRAND}22` : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, color: i === 0 ? BRAND : MUTED }}>{icon}</div>
                      ))}
                    </div>
                    {/* Kanban */}
                    <div style={{ flex: 1, padding: 14, overflow: "hidden" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                        <span style={{ fontSize: 12, fontWeight: 600, color: WHITE }}>Sprint 14 — In Progress</span>
                        <span style={{ fontSize: 10, color: BRAND, background: `${BRAND}15`, padding: "2px 7px", borderRadius: 4 }}>Live</span>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, height: "calc(100% - 32px)" }}>
                        {[
                          { label: "To Do", color: MUTED, tasks: ["Design tokens #42", "API rate limiting", "Onboarding flow"] },
                          { label: "In Progress", color: BRAND, tasks: ["Auth refactor", "MongoDB indexes"] },
                          { label: "Done", color: "#60D490", tasks: ["WebSocket setup", "CI pipeline", "Dark mode"] },
                        ].map(col => (
                          <div key={col.label} style={{ background: DARK3, borderRadius: 7, padding: 8 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 8 }}>
                              <div style={{ width: 6, height: 6, borderRadius: "50%", background: col.color }} />
                              <span style={{ fontSize: 9, fontWeight: 600, color: MUTED, textTransform: "uppercase", letterSpacing: "0.06em" }}>{col.label}</span>
                              <span style={{ marginLeft: "auto", fontSize: 9, color: MUTED }}>{col.tasks.length}</span>
                            </div>
                            {col.tasks.map(t => (
                              <div key={t} style={{ background: DARK2, border: `1px solid ${BORDER}`, borderRadius: 5, padding: "7px 8px", marginBottom: 5, fontSize: 10, color: WHITE }}>
                                {t}
                                <div style={{ marginTop: 4, height: 2, background: DARK4, borderRadius: 99 }}>
                                  <div style={{ height: "100%", width: `${40 + Math.floor(Math.random() * 50)}%`, background: col.color, borderRadius: 99 }} />
                                </div>
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </FadeIn>
            )}
          </div>
 
          {/* Stats ticker */}
          <div style={{ marginTop: isMobile ? 48 : 64, paddingTop: 32, borderTop: `1px solid ${BORDER}`, display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)", gap: isMobile ? "24px 12px" : 32 }}>
            {[["4,200+", "Teams"], ["99.98%", "Uptime"], ["80ms", "Sync latency"], ["60+", "API endpoints"]].map(([n, l]) => (
              <div key={l} style={{ opacity: 0, animation: "fadeUp 0.8s ease 1s forwards" }}>
                <div style={{ fontSize: isMobile ? 22 : 26, fontWeight: 700, color: WHITE, letterSpacing: "-0.03em" }}>{n}</div>
                <div style={{ fontSize: 11, color: MUTED, marginTop: 4, textTransform: "uppercase", letterSpacing: "0.08em" }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
 
      {/* ── FEATURES ──────────────────────────────────────────── */}
      <section id="features" style={{ padding: secPad, background: DARK2, borderTop: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <FadeIn>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <p className="section-label">Features</p>
              <h2 className="section-title">Everything your team needs.<br />Nothing it doesn't.</h2>
              <p style={{ fontSize: 15, color: MUTED, lineHeight: 1.7, marginTop: 12, maxWidth: 520, margin: "12px auto 0" }}>
                Built on a full MERN stack so every feature is real-time, API-accessible, and extensible.
              </p>
            </div>
          </FadeIn>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : isTablet ? "1fr 1fr" : "repeat(3, 1fr)", gap: 16 }}>
            {FEATURES.map((f, i) => (
              <FadeIn key={f.title} delay={i * 70}>
                <div className="feature-card hover-lift">
                  <div style={{ fontSize: 26, marginBottom: 12 }}>{f.icon}</div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
                    <h3 style={{ fontSize: 16, fontWeight: 600, color: WHITE }}>{f.title}</h3>
                    <span className="tag-pill">{f.tag}</span>
                  </div>
                  <p style={{ fontSize: 14, color: MUTED, lineHeight: 1.7 }}>{f.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
 
      {/* ── TECH STACK CALLOUT ─────────────────────────────────── */}
      
      <section style={{ padding: secPad, background: DARK }}>
  <div style={{ maxWidth: 1180, margin: "0 auto", padding: "0 16px" }}> {/* Added horizontal padding to prevent edge-bleeding on small screens */}
    <FadeIn>
      <div
        style={{
          background: DARK3,
          border: `1px solid ${BORDER}`,
          borderRadius: 14,
          padding: isMobile ? "32px 20px" : isTablet ? "40px 36px" : "48px 52px",
          display: "grid",
          
          gridTemplateColumns: isTablet ? "1fr" : "repeat(2, minmax(0, 1fr))",
          gap: isTablet ? 36 : 48,
          alignItems: "center",
        }}
      >
        <div>
          <p className="section-label">Under the hood</p>
          <h2
            style={{
              fontSize: isMobile ? 24 : 28,
              fontWeight: 700,
              letterSpacing: "-0.03em",
              color: WHITE,
              lineHeight: 1.2,
              marginBottom: 14,
            }}
          >
            Built on MERN —<br />
            open, fast, scalable.
          </h2>
          <p style={{ fontSize: 14, color: MUTED, lineHeight: 1.7, marginBottom: 24 }}>
            Every layer of FlowSync is built on the MERN stack — chosen for performance, ecosystem, and developer experience. The API is fully public so your team can build on top of it.
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button className="btn-primary" style={{ fontSize: 13, padding: "10px 18px" }}>
              Read the docs
            </button>
            <button className="btn-ghost" style={{ fontSize: 13, padding: "10px 18px" }}>
              View on GitHub
            </button>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%", minWidth: 0 }}>
  {STACK_LAYERS.map(({ layer, tech, detail, color }) => (
    <div
      key={layer}
      style={{
        background: DARK4,
        border: `1px solid ${BORDER}`,
        borderRadius: 10,
        padding: "12px 16px",
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        alignItems: isMobile ? "flex-start" : "center",
        gap: isMobile ? 10 : 14,
        minWidth: 0,
      }}
    >
      <div
        style={{
          width: 38,
          height: 38,
          borderRadius: 8,
          background: `${color}15`,
          border: `1px solid ${color}33`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <div style={{ width: 11, height: 11, borderRadius: "50%", background: color }} />
      </div>
      
      <div style={{ flex: 1, minWidth: 0, width: "100%" }}>
        <div
          style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            justifyContent: "space-between",
            alignItems: isMobile ? "flex-start" : "baseline",
            gap: isMobile ? 2 : 8,
            flexWrap: "wrap",
          }}
        >
          <span style={{ fontSize: 10, color: MUTED, textTransform: "uppercase", letterSpacing: "0.08em" }}>
            {layer}
          </span>
          <span style={{ fontSize: 12, fontWeight: 600, color: WHITE }}>
            {tech}
          </span>
        </div>
        
        <p
          style={{
            fontSize: 10,
            color: MUTED,
            marginTop: 5,
            lineHeight: 1.5,          
            whiteSpace: "normal",     
            wordBreak: "break-word",  
          }}
          className="mono"
        >
          {detail}
        </p>
      </div>
    </div>
  ))}
</div>
      </div>
    </FadeIn>
  </div>
</section>
 
      {/* ── INTEGRATIONS ──────────────────────────────────────── */}
      <section id="integrations" style={{ padding: secPad, background: DARK2, borderTop: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <FadeIn>
            <div style={{ textAlign: "center", marginBottom: 44 }}>
              <p className="section-label">Integrations</p>
              <h2 className="section-title">Plays well with your stack.</h2>
              <p style={{ fontSize: 15, color: MUTED, lineHeight: 1.7, marginTop: 12 }}>Connect FlowSync to the tools your team already loves — via native integrations or our open REST API.</p>
            </div>
          </FadeIn>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : isTablet ? "repeat(4, 1fr)" : "repeat(4, 1fr)", gap: 12 }}>
            {INTEGRATIONS.map((int, i) => (
              <FadeIn key={int.name} delay={i * 50}>
                <div className="hover-lift" style={{ background: DARK3, border: `1px solid ${BORDER}`, borderRadius: 10, padding: isMobile ? "18px 12px" : "22px 16px", textAlign: "center" }}>
                  <div style={{ fontSize: 10, color: MUTED, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 7 }}>{int.cat}</div>
                  <div style={{ fontSize: isMobile ? 14 : 16, fontWeight: 700, color: WHITE }}>{int.name}</div>
                  <div style={{ width: 22, height: 2, background: BRAND, borderRadius: 99, margin: "9px auto 0" }} />
                </div>
              </FadeIn>
            ))}
          </div>
          <FadeIn delay={200}>
            <p style={{ textAlign: "center", fontSize: 13, color: MUTED, marginTop: 24 }}>+ 40 more via our REST API and Zapier connector</p>
          </FadeIn>
        </div>
      </section>
 
      {/* ── TESTIMONIALS ──────────────────────────────────────── */}
      <section style={{ padding: secPad, background: DARK, borderTop: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <FadeIn>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <p className="section-label">Testimonials</p>
              <h2 className="section-title">Teams that ship fast use FlowSync.</h2>
            </div>
          </FadeIn>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : isTablet ? "1fr 1fr" : "repeat(3, 1fr)", gap: 16 }}>
            {TESTIMONIALS.map((t, i) => (
              <FadeIn key={t.name} delay={i * 90}>
                <div style={{ background: DARK3, border: `1px solid ${BORDER}`, borderRadius: 14, padding: isMobile ? 20 : 26 }}>
                  <div style={{ display: "flex", gap: 2, marginBottom: 14 }}>
                    {"★★★★★".split("").map((s, j) => <span key={j} className="star">{s}</span>)}
                  </div>
                  <p style={{ fontSize: 14, color: WHITE, lineHeight: 1.75, marginBottom: 18, fontWeight: 300 }}>"{t.text}"</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div className="avatar">{t.avatar}</div>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 600, color: WHITE }}>{t.name}</p>
                      <p style={{ fontSize: 12, color: MUTED }}>{t.role}</p>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
 
      {/* ── PRICING ──────────────────────────────────────────── */}
      <section id="pricing" style={{ padding: secPad, background: DARK2, borderTop: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <FadeIn>
            <div style={{ textAlign: "center", marginBottom: 40 }}>
              <p className="section-label">Pricing</p>
              <h2 className="section-title">Simple, honest pricing.</h2>
              <p style={{ fontSize: 15, color: MUTED, lineHeight: 1.7, marginTop: 10, marginBottom: 20 }}>Start free. Scale as you grow. Cancel anytime.</p>
              {/* Toggle */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                <span style={{ fontSize: 14, color: annual ? MUTED : WHITE }}>Monthly</span>
                <button className={`toggle ${annual ? "on" : ""}`} onClick={() => setAnnual(a => !a)} aria-label="Toggle annual billing">
                  <div className="toggle-knob" />
                </button>
                <span style={{ fontSize: 14, color: annual ? WHITE : MUTED }}>Annual</span>
                <span style={{ background: `${BRAND}15`, color: BRAND, border: `1px solid ${BRAND}33`, fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 99 }}>Save 20%</span>
              </div>
            </div>
          </FadeIn>
          {/* Pricing cards — stacked on mobile, side by side on desktop */}
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : isTablet ? "1fr 1fr" : "repeat(3, 1fr)", gap: isMobile ? 20 : 16, alignItems: "flex-start" }}>
            {PLANS.map((plan, i) => (
              <FadeIn key={plan.name} delay={i * 70}>
                <div className={`plan-card ${plan.popular ? "plan-popular" : ""}`} style={{ marginTop: plan.popular && !isMobile && !isTablet ? 0 : 0 }}>
                  <p style={{ fontSize: 12, fontWeight: 600, color: plan.color, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>{plan.name}</p>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 4, margin: "8px 0" }}>
                    <span style={{ fontSize: 34, fontWeight: 700, color: WHITE, letterSpacing: "-0.04em" }}>${annual ? plan.annual : plan.monthly}</span>
                    {plan.monthly > 0 && <span style={{ fontSize: 13, color: MUTED }}>/mo</span>}
                  </div>
                  <p style={{ fontSize: 13, color: MUTED, marginBottom: 20 }}>{plan.desc}</p>
                  <button className={plan.popular ? "btn-primary" : "btn-ghost"} style={{ width: "100%", marginBottom: 20, fontSize: 14 }}>
                    {plan.monthly === 0 ? "Get started free" : "Start 14-day trial"}
                  </button>
                  <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: 18 }}>
                    {plan.features.map(f => (
                      <div key={f} style={{ display: "flex", alignItems: "flex-start", marginBottom: 9, fontSize: 13, color: WHITE }}>
                        <span className="check">✓</span>{f}
                      </div>
                    ))}
                    {plan.missing?.map(f => (
                      <div key={f} style={{ display: "flex", alignItems: "flex-start", marginBottom: 9, fontSize: 13, color: MUTED }}>
                        <span className="cross">—</span>{f}
                      </div>
                    ))}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
 
      {/* ── FAQ ──────────────────────────────────────────────── */}
      <section id="faq" style={{ padding: secPad, background: DARK, borderTop: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <FadeIn>
            <div style={{ textAlign: "center", marginBottom: 44 }}>
              <p className="section-label">FAQ</p>
              <h2 className="section-title">Questions answered.</h2>
            </div>
          </FadeIn>
          {FAQS.map((faq, i) => (
            <FadeIn key={i} delay={i * 50}>
              <div className="faq-item">
                <div className="faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <p style={{ fontSize: isMobile ? 14 : 16, fontWeight: 500, color: WHITE }}>{faq.q}</p>
                  <span style={{ fontSize: 20, color: BRAND, transition: "transform 0.3s", display: "block", transform: openFaq === i ? "rotate(45deg)" : "none", flexShrink: 0 }}>+</span>
                </div>
                {openFaq === i && (
                  <div style={{ paddingBottom: 18, animation: "fadeUp 0.3s ease" }}>
                    <p style={{ fontSize: 14, color: MUTED, lineHeight: 1.75 }}>{faq.a}</p>
                  </div>
                )}
              </div>
            </FadeIn>
          ))}
        </div>
      </section>
 
      {/* ── CTA BANNER ────────────────────────────────────────── */}
      <section style={{ padding: secPad, background: DARK2, borderTop: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <FadeIn>
            <div style={{ background: DARK3, border: `1px solid ${BRAND}33`, borderRadius: 18, padding: isMobile ? "36px 20px" : "56px 48px", textAlign: "center" }}>
              <div style={{ width: 48, height: 48, background: `${BRAND}15`, border: `1px solid ${BRAND}33`, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: 22 }}>⚡</div>
              <h2 style={{ fontSize: isMobile ? 24 : 32, fontWeight: 700, letterSpacing: "-0.03em", color: WHITE, marginBottom: 12, lineHeight: 1.2 }}>
                Your team ships faster<br />starting today.
              </h2>
              <p style={{ fontSize: 15, color: MUTED, lineHeight: 1.7, marginBottom: 28 }}>
                Join 4,200+ teams already using FlowSync. Free forever on Starter — no credit card, no BS.
              </p>
              {submitted ? (
                <div style={{ background: `${BRAND}15`, border: `1px solid ${BRAND}33`, borderRadius: 10, padding: "14px 20px", color: BRAND, fontSize: 15, fontWeight: 500 }}>
                  ✓ You're on the list — check your inbox!
                </div>
              ) : (
                <div style={{ display: "flex", gap: 10, maxWidth: 420, margin: "0 auto", flexDirection: isMobile ? "column" : "row" }}>
                  <input className="input-field" type="email" placeholder="Enter your work email" value={email} onChange={e => setEmail(e.target.value)} />
                  <button className="btn-primary" onClick={() => { if (email) setSubmitted(true); }} style={{ whiteSpace: "nowrap", flexShrink: 0 }}>Get started free</button>
                </div>
              )}
              <p style={{ fontSize: 12, color: MUTED, marginTop: 14 }}>Free forever · No credit card · Cancel anytime</p>
            </div>
          </FadeIn>
        </div>
      </section>
 
      {/* ── FOOTER ───────────────────────────────────────────── */}
      <footer style={{ padding: isMobile ? "40px 16px 24px" : `48px ${px} 28px`, background: DARK, borderTop: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : isTablet ? "1fr 1fr 1fr" : "2fr 1fr 1fr 1fr", gap: isMobile ? "32px 16px" : 36, marginBottom: 36 }}>
            {/* Brand col — full width on mobile */}
            <div style={{ gridColumn: isMobile ? "1 / -1" : "auto" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 14 }}>
                <div style={{ width: 26, height: 26, background: BRAND, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="14" height="14" viewBox="0 0 18 18" fill="none"><path d="M3 9h5M10 9h5M9 3v5M9 10v5" stroke="#070B0F" strokeWidth="2.2" strokeLinecap="round"/></svg>
                </div>
                <span style={{ fontSize: 15, fontWeight: 700, color: WHITE }}>FlowSync</span>
              </div>
              <p style={{ fontSize: 13, color: MUTED, lineHeight: 1.7, maxWidth: 240 }}>Project management for engineering teams who ship. MERN-powered, API-first.</p>
            </div>
            {[
              { label: "Product", links: ["Features", "Pricing", "Changelog", "Roadmap"] },
              { label: "Developers", links: ["API docs", "Webhooks", "SDK", "Status"] },
              { label: "Company", links: ["About", "Blog", "Careers", "Contact"] },
            ].map(col => (
              <div key={col.label}>
                <p style={{ fontSize: 11, fontWeight: 600, color: WHITE, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 14 }}>{col.label}</p>
                {col.links.map(l => (
                  <p key={l} style={{ fontSize: 13, color: MUTED, marginBottom: 9, cursor: "pointer", transition: "color 0.2s" }}
                    onMouseEnter={e => e.target.style.color = WHITE}
                    onMouseLeave={e => e.target.style.color = MUTED}>{l}</p>
                ))}
              </div>
            ))}
          </div>
          <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexDirection: isMobile ? "column" : "row", gap: 10, textAlign: isMobile ? "center" : "left" }}>
            <p style={{ fontSize: 12, color: MUTED }}>© 2026 FlowSync Inc. All rights reserved.</p>
            <p style={{ fontSize: 12, color: MUTED }}>Built by <span style={{ color: BRAND }}>Ahamed Shahmi</span> · shahmiahamed123@gmail.com</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
 
