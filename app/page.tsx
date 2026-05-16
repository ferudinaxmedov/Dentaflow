"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  Globe, Briefcase, Bot, Smartphone, BarChart3, Shield,
  ChevronDown, Star, Check, X, ArrowRight, Sparkles,
  Menu, MessageCircle, Mail,
} from "lucide-react";

// ── Particles ──────────────────────────────────────────────────────────────
function ParticlesCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let raf: number;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);
    const pts = Array.from({ length: 70 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.5 + 0.5,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      alpha: Math.random() * 0.5 + 0.1,
    }));
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pts.forEach((p) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width; if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(62,207,178,${p.alpha})`;
        ctx.fill();
      });
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = `rgba(62,207,178,${0.06 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} id="particles-canvas" />;
}

// ── Animation helper ───────────────────────────────────────────────────────
function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }} className={className}>
      {children}
    </motion.div>
  );
}

// ── Navbar ─────────────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? "glass border-b border-[rgba(62,207,178,0.1)]" : ""}`}>
      <nav className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <span className="text-2xl">🦷</span>
          <span style={{ color: "#3ECFB2" }}>DentaFlow</span>
        </Link>
        <div className="hidden md:flex items-center gap-7 text-sm" style={{ color: "#7A9990" }}>
          {[["#xususiyatlar","Xususiyatlar"],["#tariflar","Tariflar"],["#demo","Demo"],["#aloqa","Bog'lanish"]] .map(([href,label]) => (
            <a key={href} href={href} className="hover:text-white transition-colors">{label}</a>
          ))}
        </div>
        <div className="hidden md:flex items-center gap-3">
          <div className="flex gap-1 text-xs" style={{ color: "#7A9990" }}>
            <button className="px-2 py-1 rounded font-medium" style={{ color: "#F0F5F3" }}>UZ</button>
            <span>/</span>
            <button className="px-2 py-1 rounded hover:text-white transition-colors">RU</button>
          </div>
          <Link href="/boshlash"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:scale-105"
            style={{ background: "#3ECFB2", color: "#050D0A" }}>
            Bepul boshlash <ArrowRight size={14} />
          </Link>
        </div>
        <button className="md:hidden p-2 rounded-lg" style={{ color: "#7A9990" }} onClick={() => setMobileOpen(!mobileOpen)}>
          <Menu size={20} />
        </button>
      </nav>
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-[rgba(62,207,178,0.1)] px-5 py-4 space-y-3">
            {[["#xususiyatlar","Xususiyatlar"],["#tariflar","Tariflar"],["#demo","Demo"],["#aloqa","Bog'lanish"]].map(([href,label]) => (
              <a key={href} href={href} onClick={() => setMobileOpen(false)}
                className="block py-2 text-sm" style={{ color: "#7A9990" }}>{label}</a>
            ))}
            <Link href="/boshlash" onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl text-sm font-semibold"
              style={{ background: "#3ECFB2", color: "#050D0A" }}>
              Bepul boshlash <ArrowRight size={14} />
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

// ── Hero ───────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(62,207,178,0.08) 0%, transparent 70%)", filter: "blur(40px)" }} />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%)", filter: "blur(40px)" }} />
      <div className="relative z-10 max-w-5xl mx-auto px-5 text-center">
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-6 border"
          style={{ borderColor: "rgba(62,207,178,0.3)", background: "rgba(62,207,178,0.08)", color: "#3ECFB2" }}>
          <Sparkles size={14} />
          O&apos;zbekistondagi #1 Dental Platform
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6" style={{ color: "#F0F5F3" }}>
          Klinikangizni{" "}
          <span className="gradient-text">raqamli kelajakka</span>{" "}
          olib chiqing
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
          className="text-lg sm:text-xl mb-10 max-w-2xl mx-auto" style={{ color: "#7A9990" }}>
          Bemorlar, navbatlar, to&apos;lovlar, AI hujjatlar — hammasi bir joyda.
          <br /><span style={{ color: "#F0F5F3" }}>Starter — 14 kun &nbsp;•&nbsp; Pro — 7 kun bepul sinov.</span>
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link href="/boshlash"
            className="group flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-base transition-all hover:scale-105 glow-teal"
            style={{ background: "#3ECFB2", color: "#050D0A" }}>
            Bepul boshlash
            <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <a href="#demo"
            className="flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-base border transition-all hover:scale-105"
            style={{ borderColor: "rgba(62,207,178,0.3)", color: "#3ECFB2", background: "rgba(62,207,178,0.05)" }}>
            Demo ko&apos;rish
          </a>
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-8 mb-16">
          {[{ value: "50+", label: "Klinika" }, { value: "5000+", label: "Bemor" }, { value: "AI", label: "PDF hujjat" }, { value: "24/7", label: "Telegram Bot" }].map(({ value, label }) => (
            <div key={label} className="text-center">
              <div className="text-2xl font-bold" style={{ color: "#3ECFB2" }}>{value}</div>
              <div className="text-xs mt-0.5" style={{ color: "#7A9990" }}>{label}</div>
            </div>
          ))}
        </motion.div>
        {/* Dashboard mockup */}
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.6 }}
          className="relative mx-auto max-w-3xl">
          <div className="rounded-2xl overflow-hidden border glow-teal"
            style={{ borderColor: "rgba(62,207,178,0.2)", background: "#0C1714" }}>
            <div className="flex items-center gap-2 px-4 py-3 border-b" style={{ borderColor: "rgba(62,207,178,0.1)" }}>
              <div className="w-3 h-3 rounded-full" style={{ background: "rgba(239,68,68,0.6)" }} />
              <div className="w-3 h-3 rounded-full" style={{ background: "rgba(234,179,8,0.6)" }} />
              <div className="w-3 h-3 rounded-full" style={{ background: "rgba(62,207,178,0.6)" }} />
              <div className="flex-1 mx-4 px-3 py-1 rounded-md text-xs" style={{ background: "rgba(0,0,0,0.3)", color: "#7A9990" }}>
                admin.dentaflow.uz/dashboard
              </div>
            </div>
            <div className="flex" style={{ height: 220 }}>
              <div className="w-14 border-r space-y-3 p-2 pt-4" style={{ borderColor: "rgba(62,207,178,0.08)", background: "rgba(0,0,0,0.2)" }}>
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="w-full h-6 rounded" style={{ background: i === 0 ? "rgba(62,207,178,0.2)" : "rgba(255,255,255,0.04)" }} />
                ))}
              </div>
              <div className="flex-1 p-4 space-y-3">
                <div className="grid grid-cols-3 gap-2">
                  {[{ label: "Bemorlar", val: "1,247", c: "#3ECFB2" }, { label: "Bugun", val: "23", c: "#7C3AED" }, { label: "Daromad", val: "4.2M", c: "#22d3ee" }].map(({ label, val, c }) => (
                    <div key={label} className="rounded-lg p-2.5" style={{ background: "rgba(255,255,255,0.04)" }}>
                      <div className="text-[10px] mb-1" style={{ color: "#7A9990" }}>{label}</div>
                      <div className="text-base font-bold" style={{ color: c }}>{val}</div>
                    </div>
                  ))}
                </div>
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full shrink-0" style={{ background: "rgba(62,207,178,0.15)" }} />
                    <div className="h-2.5 rounded flex-1" style={{ background: "rgba(255,255,255,0.06)" }} />
                    <div className="w-12 h-4 rounded shrink-0" style={{ background: i === 1 ? "rgba(62,207,178,0.2)" : "rgba(255,255,255,0.04)" }} />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-3/4 h-12"
            style={{ background: "radial-gradient(ellipse, rgba(62,207,178,0.2) 0%, transparent 70%)", filter: "blur(12px)" }} />
        </motion.div>
      </div>
    </section>
  );
}

// ── Problems ───────────────────────────────────────────────────────────────
function Problems() {
  const problems = [
    { icon: "📋", title: "Qog'oz jurnallar", desc: "Xatolar, vaqt isrof, ma'lumotlar yo'qoladi. Izlash qiyin, tahlil mumkin emas.", color: "#ef4444" },
    { icon: "💸", title: "Nazorat yo'q", desc: "Qarzlar ko'zdan ketadi, daromad noaniq, pul qayerga ketayotgani noma'lum.", color: "#f97316" },
    { icon: "📞", title: "Mijozlar yo'qoladi", desc: "Eslatma yo'q — bemor unutadi. Qaytmaydi. Raqobat klinikaga ketadi.", color: "#eab308" },
  ];
  return (
    <section className="py-24 px-5">
      <div className="max-w-5xl mx-auto">
        <FadeIn className="text-center mb-14">
          <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: "#3ECFB2" }}>Muammo</p>
          <h2 className="text-3xl sm:text-4xl font-bold" style={{ color: "#F0F5F3" }}>
            Ko&apos;pchilik klinikalar hali ham...
          </h2>
        </FadeIn>
        <div className="grid sm:grid-cols-3 gap-5">
          {problems.map(({ icon, title, desc, color }, i) => (
            <FadeIn key={title} delay={i * 0.1}>
              <div className="glass rounded-2xl p-6 h-full border-t-2" style={{ borderTopColor: color + "60" }}>
                <div className="text-4xl mb-4">{icon}</div>
                <h3 className="font-bold text-lg mb-2" style={{ color }}>{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#7A9990" }}>{desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Features ───────────────────────────────────────────────────────────────
function Features() {
  const features = [
    { icon: <Globe size={22} />, title: "Professional Website", desc: "3 tilda (UZ/RU/EN), SEO tayyor, mobil responsiv. Bemor siz haqingizda onlayn topadi." },
    { icon: <Briefcase size={22} />, title: "Workplace", desc: "Admin, shifokor, registrator — har biri o'z paneli. Ruxsatlar tizimi." },
    { icon: <Bot size={22} />, title: "AI Hujjatlar", desc: "Tashxis va retseptni AI tahlil qiladi, chiroyli PDF yaratadi. Bir klik." },
    { icon: <Smartphone size={22} />, title: "Telegram Bot", desc: "24/7 navbat yozish, eslatmalar, bemor tarixini ko'rish — Telegramdan." },
    { icon: <BarChart3 size={22} />, title: "Analytics", desc: "Daromad, navbatlar, shifokorlar samaradorligi — grafiklar va hisobotlar." },
    { icon: <Shield size={22} />, title: "Xavfsizlik", desc: "Ma'lumotlar shifrlangan, kunlik backup. GDPR va mahalliy qonunlarga mos." },
  ];
  return (
    <section id="xususiyatlar" className="py-24 px-5">
      <div className="max-w-5xl mx-auto">
        <FadeIn className="text-center mb-14">
          <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: "#3ECFB2" }}>Yechim</p>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: "#F0F5F3" }}>
            DentaFlow — bitta tizim, hamma yechim
          </h2>
          <p style={{ color: "#7A9990" }}>Dental klinika uchun kerak bo&apos;lgan hamma narsa.</p>
        </FadeIn>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map(({ icon, title, desc }, i) => (
            <FadeIn key={title} delay={i * 0.08}>
              <motion.div whileHover={{ y: -4 }} className="glass rounded-2xl p-6 h-full cursor-default">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: "rgba(62,207,178,0.12)", color: "#3ECFB2" }}>
                  {icon}
                </div>
                <h3 className="font-bold mb-2" style={{ color: "#F0F5F3" }}>{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#7A9990" }}>{desc}</p>
              </motion.div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── How It Works ───────────────────────────────────────────────────────────
function HowItWorks() {
  const steps = [
    { num: "01", title: "Ro'yxatdan o'ting", desc: "2 daqiqa. Faqat ism va telefon.", time: "2 daqiqa" },
    { num: "02", title: "Klinikangizni sozlang", desc: "Xizmatlar, shifokorlar, ish vaqti — oddiy forma.", time: "10 daqiqa" },
    { num: "03", title: "Ishga tushing!", desc: "Subdomen tayyor. Xodimlarni ulang. Boshlang.", time: "Darhol" },
  ];
  return (
    <section id="demo" className="py-24 px-5">
      <div className="max-w-4xl mx-auto">
        <FadeIn className="text-center mb-14">
          <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: "#3ECFB2" }}>Qanday ishlaydi</p>
          <h2 className="text-3xl sm:text-4xl font-bold" style={{ color: "#F0F5F3" }}>3 qadam — tayyor</h2>
        </FadeIn>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map(({ num, title, desc, time }, i) => (
            <FadeIn key={num} delay={i * 0.15} className="text-center">
              <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-5 mx-auto"
                style={{ background: "rgba(62,207,178,0.1)", border: "1px solid rgba(62,207,178,0.25)" }}>
                <span className="text-2xl font-bold" style={{ color: "#3ECFB2" }}>{num}</span>
                <span className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full text-[10px] font-bold"
                  style={{ background: "#0C1714", color: "#3ECFB2", border: "1px solid rgba(62,207,178,0.3)" }}>
                  {time}
                </span>
              </div>
              <h3 className="font-bold text-lg mb-2" style={{ color: "#F0F5F3" }}>{title}</h3>
              <p className="text-sm" style={{ color: "#7A9990" }}>{desc}</p>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Pricing ────────────────────────────────────────────────────────────────
function Pricing() {
  const plans = [
    {
      name: "Starter", price: "299 000", period: "so'm/oy",
      desc: "Kichik klinikalar uchun", badge: null, trialBadge: "🕐 14 kun sinov", highlight: false,
      trial: "14 kun bepul sinov", cta: "Bepul boshlash →",
      features: [
        { t: "Website (1 til)", ok: true }, { t: "Bemorlar CRM (500 ta)", ok: true },
        { t: "Navbat jadvali", ok: true }, { t: "Telegram bot", ok: true },
        { t: "3 xodim", ok: true }, { t: "AI PDF hujjat", ok: false },
        { t: "SMS eslatmalar", ok: false }, { t: "Hisobotlar", ok: false },
      ],
    },
    {
      name: "Pro", price: "599 000", period: "so'm/oy",
      desc: "O'sib borayotgan klinikalar", badge: "⭐ Tavsiya etiladi", trialBadge: "⚡ Tezkor sinov", highlight: true,
      trial: "7 kun bepul sinov", cta: "Bepul boshlash →",
      features: [
        { t: "Website (3 til)", ok: true }, { t: "Cheksiz bemorlar", ok: true },
        { t: "To'liq Workplace", ok: true }, { t: "AI tibbiy PDF", ok: true },
        { t: "SMS eslatmalar", ok: true }, { t: "Cheksiz xodim", ok: true },
        { t: "To'liq hisobotlar", ok: true }, { t: "Ustuvor support", ok: true },
      ],
    },
    {
      name: "Enterprise", price: "Muzokarali", period: "",
      desc: "Ko'p filial, yirik klinikalar", badge: null, trialBadge: null, highlight: false,
      trial: "Demo so'rash", cta: "Demo so'rash →",
      features: [
        { t: "Barcha Pro xususiyatlar", ok: true }, { t: "Multi-filial", ok: true },
        { t: "Custom domen", ok: true }, { t: "API integratsiya", ok: true },
        { t: "Maxsus xususiyatlar", ok: true }, { t: "Onboarding yordami", ok: true },
        { t: "24/7 qo'llab-quvvatlash", ok: true }, { t: "SLA kafolati", ok: true },
      ],
    },
  ];
  return (
    <section id="tariflar" className="py-24 px-5">
      <div className="max-w-5xl mx-auto">
        <FadeIn className="text-center mb-14">
          <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: "#3ECFB2" }}>Tariflar</p>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: "#F0F5F3" }}>Sizga mos tarifni tanlang</h2>
          <p style={{ color: "#7A9990" }}>Starter — 14 kun &nbsp;•&nbsp; Pro — 7 kun &nbsp;•&nbsp; Karta shart emas</p>
        </FadeIn>
        <div className="grid sm:grid-cols-3 gap-5 items-stretch">
          {plans.map(({ name, price, period, desc, badge, trialBadge, trial, cta, highlight, features }, i) => (
            <FadeIn key={name} delay={i * 0.1}>
              <motion.div whileHover={{ y: -6 }} className="relative rounded-2xl p-6 h-full flex flex-col"
                style={{
                  background: highlight ? "linear-gradient(135deg, rgba(62,207,178,0.08) 0%, rgba(124,58,237,0.08) 100%)" : "rgba(12,23,20,0.7)",
                  border: `1px solid ${highlight ? "rgba(62,207,178,0.35)" : "rgba(62,207,178,0.1)"}`,
                  backdropFilter: "blur(12px)",
                  boxShadow: highlight ? "0 0 40px rgba(62,207,178,0.1)" : "none",
                }}>
                {badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold whitespace-nowrap"
                    style={{ background: "linear-gradient(90deg, #3ECFB2, #7C3AED)", color: "#fff" }}>
                    {badge}
                  </div>
                )}
                <div className="mb-5">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-lg" style={{ color: "#F0F5F3" }}>{name}</h3>
                    {trialBadge && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap"
                        style={{ background: highlight ? "rgba(124,58,237,0.2)" : "rgba(62,207,178,0.1)", color: highlight ? "#a78bfa" : "#3ECFB2", border: `1px solid ${highlight ? "rgba(124,58,237,0.3)" : "rgba(62,207,178,0.2)"}` }}>
                        {trialBadge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs mb-1" style={{ color: "#7A9990" }}>{desc}</p>
                  <p className="text-xs mb-3 font-medium" style={{ color: highlight ? "#a78bfa" : "#3ECFB2" }}>{trial}</p>
                  <div className="flex items-end gap-1">
                    <span className="text-3xl font-bold" style={{ color: highlight ? "#3ECFB2" : "#F0F5F3" }}>{price}</span>
                    {period && <span className="text-sm mb-1" style={{ color: "#7A9990" }}>{period}</span>}
                  </div>
                </div>
                <ul className="space-y-2.5 flex-1 mb-6">
                  {features.map(({ t, ok }) => (
                    <li key={t} className="flex items-center gap-2.5 text-sm">
                      {ok ? <Check size={14} className="shrink-0" style={{ color: "#3ECFB2" }} />
                           : <X size={14} className="shrink-0" style={{ color: "#4a6e64" }} />}
                      <span style={{ color: ok ? "#F0F5F3" : "#4a6e64" }}>{t}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/boshlash"
                  className="block text-center py-3 rounded-xl text-sm font-semibold transition-all hover:scale-105"
                  style={highlight
                    ? { background: "#3ECFB2", color: "#050D0A" }
                    : { background: "rgba(62,207,178,0.1)", color: "#3ECFB2", border: "1px solid rgba(62,207,178,0.25)" }}>
                  {cta}
                </Link>
              </motion.div>
            </FadeIn>
          ))}
        </div>
        <FadeIn>
          <p className="text-center mt-8 text-sm" style={{ color: "#7A9990" }}>
            ✅ Starter — 14 kun &nbsp;•&nbsp; Pro — 7 kun &nbsp;•&nbsp; Karta shart emas &nbsp;•&nbsp; Istalgan vaqt bekor qilish
          </p>
        </FadeIn>
      </div>
    </section>
  );
}

// ── Testimonials ───────────────────────────────────────────────────────────
function Testimonials() {
  const reviews = [
    { name: "Gulnora Yusupova", clinic: "SmilePro Dental", city: "Toshkent", stars: 5, text: "3 oydan beri ishlatamiz. Navbatlar tartibga kirdi, bemor yo'qolishi 60% kamaydi. AI PDF juda qulay — vaqt tejaydi." },
    { name: "Bahodir Rahimov",  clinic: "White Teeth",     city: "Samarqand", stars: 5, text: "Telegram bot eng yaxshi xususiyat. Bemorlar o'zlari navbat yozadi, biz shunchaki tasdiqlashimiz kerak. Ajoyib!" },
    { name: "Dilnoza Hasanova", clinic: "Dental Plus",     city: "Buxoro",    stars: 5, text: "Hisobotlar bo'limi daromadni nazorat qilishni osonlashtirdi. Endi hamma narsa ko'rinadi. Tavsiya qilaman!" },
  ];
  return (
    <section className="py-24 px-5" style={{ background: "rgba(12,23,20,0.4)" }}>
      <div className="max-w-5xl mx-auto">
        <FadeIn className="text-center mb-14">
          <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: "#3ECFB2" }}>Fikrlar</p>
          <h2 className="text-3xl sm:text-4xl font-bold" style={{ color: "#F0F5F3" }}>Klinikalar nima deyapti</h2>
        </FadeIn>
        <div className="grid sm:grid-cols-3 gap-5">
          {reviews.map(({ name, clinic, city, stars, text }, i) => (
            <FadeIn key={name} delay={i * 0.1}>
              <div className="glass rounded-2xl p-6 h-full flex flex-col">
                <div className="flex mb-3">
                  {[...Array(stars)].map((_, j) => <Star key={j} size={14} fill="#3ECFB2" style={{ color: "#3ECFB2" }} />)}
                </div>
                <p className="text-sm leading-relaxed flex-1 mb-4" style={{ color: "#C0D5CF" }}>&ldquo;{text}&rdquo;</p>
                <div>
                  <p className="font-semibold text-sm" style={{ color: "#F0F5F3" }}>{name}</p>
                  <p className="text-xs" style={{ color: "#7A9990" }}>{clinic} · {city}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── FAQ ────────────────────────────────────────────────────────────────────
function FAQ() {
  const [open, setOpen] = useState<number | null>(null);
  const items = [
    { q: "Ro'yxatdan o'tish qancha vaqt oladi?", a: "2-3 daqiqa. Faqat klinika nomingiz va telefon raqamingiz kerak. Hech qanday texnik bilim talab etilmaydi." },
    { q: "Ma'lumotlarim xavfsizmi?", a: "Ha. Ma'lumotlaringiz SSL/TLS bilan shifrlangan, Supabase serverlarida saqlanadi, har kuni backup qilinadi. Siz yagona egasiz." },
    { q: "Internetim bo'lmasa ishlayaptimi?", a: "Asosiy funksiyalar uchun internet kerak. Lekin oxirgi ko'rilgan ma'lumotlar kesh qilinadi. Tez orada offline rejim qo'shiladi." },
    { q: "O'z domenimni ulasa bo'ladimi?", a: "Ha, Enterprise tarifida custom domen qo'shish mumkin. Pro tarifida klinikangiz.dentaflow.uz subdomen taqdim etiladi." },
    { q: "Shartnoma bormi?", a: "Yo'q. Oylik to'lov, istalgan vaqt bekor qilish. Majburiy shartnoma yoki yashirin to'lovlar yo'q." },
    { q: "Bekor qilsam ma'lumotlarim yo'qoladimi?", a: "Yo'q. Bekor qilishdan oldin ma'lumotlaringizni export qila olasiz. Biz 90 kun davomida ma'lumotlaringizni saqlaymiz." },
  ];
  return (
    <section className="py-24 px-5">
      <div className="max-w-2xl mx-auto">
        <FadeIn className="text-center mb-14">
          <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: "#3ECFB2" }}>FAQ</p>
          <h2 className="text-3xl font-bold" style={{ color: "#F0F5F3" }}>Ko&apos;p so&apos;raladigan savollar</h2>
        </FadeIn>
        <div className="space-y-3">
          {items.map(({ q, a }, i) => (
            <FadeIn key={i} delay={i * 0.05}>
              <div className="glass rounded-2xl overflow-hidden">
                <button onClick={() => setOpen(open === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left gap-4">
                  <span className="font-medium text-sm" style={{ color: "#F0F5F3" }}>{q}</span>
                  <ChevronDown size={16} className="shrink-0 transition-transform duration-200"
                    style={{ color: "#3ECFB2", transform: open === i ? "rotate(180deg)" : "none" }} />
                </button>
                <AnimatePresence initial={false}>
                  {open === i && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
                      <p className="px-6 pb-4 text-sm leading-relaxed" style={{ color: "#7A9990" }}>{a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── CTA ────────────────────────────────────────────────────────────────────
function CTA() {
  return (
    <section className="py-24 px-5">
      <div className="max-w-3xl mx-auto">
        <FadeIn>
          <div className="relative rounded-3xl p-12 text-center overflow-hidden"
            style={{ background: "linear-gradient(135deg, rgba(62,207,178,0.12) 0%, rgba(124,58,237,0.12) 100%)", border: "1px solid rgba(62,207,178,0.2)" }}>
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: "radial-gradient(ellipse at center, rgba(62,207,178,0.06) 0%, transparent 70%)" }} />
            <div className="relative">
              <div className="text-5xl mb-4">🚀</div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: "#F0F5F3" }}>
                Bugun boshlang — bepul sinov
              </h2>
              <p className="mb-8 text-lg" style={{ color: "#7A9990" }}>
                O&apos;zbekistondagi yuzlab klinikalar DentaFlow bilan ishlayapti. Siz ham qo&apos;shiling.
              </p>
              <Link href="/boshlash"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-lg font-bold transition-all hover:scale-105 glow-teal"
                style={{ background: "#3ECFB2", color: "#050D0A" }}>
                Ro&apos;yxatdan o&apos;tish <ArrowRight size={20} />
              </Link>
              <p className="mt-4 text-sm" style={{ color: "#4a6e64" }}>
                Karta shart emas &nbsp;•&nbsp; Istalgan vaqt bekor qilish
              </p>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

// ── Footer ─────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer id="aloqa" className="py-12 px-5 border-t" style={{ borderColor: "rgba(62,207,178,0.1)" }}>
      <div className="max-w-5xl mx-auto">
        <div className="grid sm:grid-cols-4 gap-8 mb-10">
          <div className="sm:col-span-2">
            <div className="flex items-center gap-2 font-bold text-xl mb-3">
              <span className="text-2xl">🦷</span>
              <span style={{ color: "#3ECFB2" }}>DentaFlow</span>
            </div>
            <p className="text-sm leading-relaxed mb-4" style={{ color: "#7A9990" }}>
              O&apos;zbekistondagi dental klinikalar uchun eng yaxshi raqamli boshqaruv tizimi.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="https://t.me/dentaflow" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-colors hover:opacity-80"
                style={{ background: "rgba(62,207,178,0.1)", color: "#3ECFB2", border: "1px solid rgba(62,207,178,0.2)" }}>
                <MessageCircle size={13} /> @dentaflow
              </a>
              <a href="mailto:info@dentaflow.uz"
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-colors hover:opacity-80"
                style={{ background: "rgba(62,207,178,0.1)", color: "#3ECFB2", border: "1px solid rgba(62,207,178,0.2)" }}>
                <Mail size={13} /> info@dentaflow.uz
              </a>
            </div>
          </div>
          <div>
            <p className="font-semibold text-sm mb-3" style={{ color: "#F0F5F3" }}>Mahsulot</p>
            <ul className="space-y-2 text-sm" style={{ color: "#7A9990" }}>
              {["Xususiyatlar", "Tariflar", "Blog", "Yangiliklar"].map((l) => (
                <li key={l}><a href="#" className="hover:text-white transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-semibold text-sm mb-3" style={{ color: "#F0F5F3" }}>Yordam</p>
            <ul className="space-y-2 text-sm" style={{ color: "#7A9990" }}>
              {["Dokumentatsiya", "Video darslar", "Qo'llab-quvvatlash", "Hamkorlik"].map((l) => (
                <li key={l}><a href="#" className="hover:text-white transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-8 border-t text-xs"
          style={{ borderColor: "rgba(62,207,178,0.08)", color: "#4a6e64" }}>
          <p>© 2026 DentaFlow. Barcha huquqlar himoyalangan.</p>
          <div className="flex gap-4">
            {["Maxfiylik siyosati", "Foydalanish shartlari", "Cookie"].map((l) => (
              <a key={l} href="#" className="hover:text-white transition-colors">{l}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

// ── PAGE ───────────────────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <div className="relative min-h-screen" style={{ background: "#050D0A" }}>
      <ParticlesCanvas />
      <div className="relative z-10">
        <Navbar />
        <Hero />
        <Problems />
        <Features />
        <HowItWorks />
        <Pricing />
        <Testimonials />
        <FAQ />
        <CTA />
        <Footer />
      </div>
    </div>
  );
}
