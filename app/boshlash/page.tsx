"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Check, Eye, EyeOff, Sparkles, Copy } from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────
interface FormData {
  clinicName: string; phone: string; city: string; hours: string;
  fullName: string; email: string; password: string; confirmPassword: string;
  subdomain: string; plan: "starter" | "pro" | "enterprise" | "";
}

// ── Helpers ────────────────────────────────────────────────────────────────
function toSlug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
}

const inputCls = `w-full px-4 py-3 rounded-xl text-sm outline-none transition-all
  bg-[rgba(0,0,0,0.3)] border border-[rgba(62,207,178,0.15)] text-[#F0F5F3]
  placeholder-[#4a6e64] focus:border-[rgba(62,207,178,0.5)] focus:ring-2 focus:ring-[rgba(62,207,178,0.1)]`;

const labelCls = "block text-xs font-semibold uppercase tracking-wide mb-1.5 text-[#7A9990]";

// ── Step indicator ─────────────────────────────────────────────────────────
const STEPS = ["Klinika", "Akkaunt", "Subdomen", "Tarif", "Tayyor!"];

function StepBar({ step }: { step: number }) {
  return (
    <div className="flex items-center gap-0 mb-10">
      {STEPS.map((label, i) => (
        <div key={i} className="flex items-center flex-1 last:flex-none">
          <div className="flex flex-col items-center gap-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
              i < step ? "text-[#050D0A]" : i === step ? "text-[#050D0A]" : "text-[#4a6e64]"
            }`} style={{
              background: i <= step ? "#3ECFB2" : "rgba(62,207,178,0.08)",
              border: i === step ? "2px solid rgba(62,207,178,0.8)" : "1px solid rgba(62,207,178,0.2)",
            }}>
              {i < step ? <Check size={14} /> : i + 1}
            </div>
            <span className="text-[9px] hidden sm:block whitespace-nowrap"
              style={{ color: i === step ? "#3ECFB2" : "#4a6e64" }}>{label}</span>
          </div>
          {i < STEPS.length - 1 && (
            <div className="flex-1 h-px mx-1" style={{ background: i < step ? "#3ECFB2" : "rgba(62,207,178,0.1)" }} />
          )}
        </div>
      ))}
    </div>
  );
}

// ── Step 1: Klinika ────────────────────────────────────────────────────────
function Step1({ data, onChange }: { data: FormData; onChange: (k: keyof FormData, v: string) => void }) {
  return (
    <div className="space-y-5">
      <div>
        <label className={labelCls}>Klinika nomi *</label>
        <input className={inputCls} value={data.clinicName} placeholder="Hamida Stom Service"
          onChange={(e) => onChange("clinicName", e.target.value)} />
      </div>
      <div>
        <label className={labelCls}>Telefon raqam *</label>
        <input className={inputCls} value={data.phone} placeholder="+998 93 478 79 14" type="tel"
          onChange={(e) => onChange("phone", e.target.value)} />
      </div>
      <div>
        <label className={labelCls}>Shahar / Tuman</label>
        <input className={inputCls} value={data.city} placeholder="Toshkent, Chilonzor"
          onChange={(e) => onChange("city", e.target.value)} />
      </div>
      <div>
        <label className={labelCls}>Ish vaqti</label>
        <input className={inputCls} value={data.hours} placeholder="Du–Sh: 09:00–20:00"
          onChange={(e) => onChange("hours", e.target.value)} />
      </div>
    </div>
  );
}

// ── Step 2: Akkaunt ────────────────────────────────────────────────────────
function Step2({ data, onChange }: { data: FormData; onChange: (k: keyof FormData, v: string) => void }) {
  const [showPass, setShowPass] = useState(false);
  const [showConf, setShowConf] = useState(false);
  return (
    <div className="space-y-5">
      <div>
        <label className={labelCls}>To'liq ism</label>
        <input className={inputCls} value={data.fullName} placeholder="Hamida Nazarova"
          onChange={(e) => onChange("fullName", e.target.value)} />
      </div>
      <div>
        <label className={labelCls}>Email *</label>
        <input className={inputCls} value={data.email} placeholder="hamida@klinika.uz" type="email"
          onChange={(e) => onChange("email", e.target.value)} />
      </div>
      <div>
        <label className={labelCls}>Parol * (kamida 8 belgi)</label>
        <div className="relative">
          <input className={inputCls + " pr-10"} value={data.password}
            type={showPass ? "text" : "password"} placeholder="••••••••"
            onChange={(e) => onChange("password", e.target.value)} />
          <button type="button" onClick={() => setShowPass(!showPass)}
            className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "#7A9990" }}>
            {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {data.password && (
          <div className="mt-2 flex gap-1">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-1 flex-1 rounded-full transition-all"
                style={{ background: data.password.length >= (i + 1) * 2 ? (data.password.length >= 8 ? "#3ECFB2" : "#f97316") : "rgba(255,255,255,0.1)" }} />
            ))}
          </div>
        )}
      </div>
      <div>
        <label className={labelCls}>Parolni tasdiqlang *</label>
        <div className="relative">
          <input className={inputCls + " pr-10"} value={data.confirmPassword}
            type={showConf ? "text" : "password"} placeholder="••••••••"
            onChange={(e) => onChange("confirmPassword", e.target.value)} />
          <button type="button" onClick={() => setShowConf(!showConf)}
            className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "#7A9990" }}>
            {showConf ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {data.confirmPassword && data.password !== data.confirmPassword && (
          <p className="mt-1.5 text-xs" style={{ color: "#ef4444" }}>Parollar mos kelmaydi</p>
        )}
      </div>
    </div>
  );
}

// ── Step 3: Subdomain ──────────────────────────────────────────────────────
function Step3({ data, onChange }: { data: FormData; onChange: (k: keyof FormData, v: string) => void }) {
  const [checking, setChecking] = useState(false);
  const [available, setAvailable] = useState<boolean | null>(null);
  const suggested = toSlug(data.clinicName) || "mening-klinikam";

  useEffect(() => {
    if (!data.subdomain) return;
    setChecking(true);
    setAvailable(null);
    const t = setTimeout(() => {
      setChecking(false);
      setAvailable(data.subdomain.length >= 3 && data.subdomain !== "admin" && data.subdomain !== "test");
    }, 700);
    return () => clearTimeout(t);
  }, [data.subdomain]);

  return (
    <div className="space-y-5">
      <div>
        <label className={labelCls}>Subdomeni tanlang</label>
        <div className="flex items-center gap-0 overflow-hidden rounded-xl border"
          style={{ borderColor: available === true ? "rgba(62,207,178,0.5)" : available === false ? "rgba(239,68,68,0.5)" : "rgba(62,207,178,0.15)" }}>
          <input
            className="flex-1 px-4 py-3 text-sm bg-[rgba(0,0,0,0.3)] text-[#F0F5F3] placeholder-[#4a6e64] outline-none"
            value={data.subdomain} placeholder={suggested}
            onChange={(e) => onChange("subdomain", toSlug(e.target.value))}
          />
          <div className="px-3 py-3 shrink-0 text-sm font-medium border-l" style={{ borderColor: "rgba(62,207,178,0.15)", background: "rgba(62,207,178,0.05)", color: "#7A9990" }}>
            .dentaflow.uz
          </div>
        </div>
        <div className="mt-2 flex items-center gap-2 text-xs">
          {checking && <span style={{ color: "#7A9990" }}>Tekshirilmoqda…</span>}
          {!checking && available === true && <><Check size={12} style={{ color: "#3ECFB2" }} /><span style={{ color: "#3ECFB2" }}>Bo&apos;sh — ajoyib!</span></>}
          {!checking && available === false && <span style={{ color: "#ef4444" }}>Bu nom band. Boshqasini sinab ko&apos;ring.</span>}
        </div>
      </div>
      {/* Suggestions */}
      <div>
        <p className="text-xs mb-2" style={{ color: "#7A9990" }}>Taklif etiladi:</p>
        <div className="flex flex-wrap gap-2">
          {[suggested, suggested + "-tosh", suggested + "-uz", "dental-" + suggested].map((s) => (
            <button key={s} onClick={() => onChange("subdomain", s)}
              className="px-3 py-1.5 rounded-lg text-xs border transition-all hover:scale-105"
              style={{
                borderColor: data.subdomain === s ? "rgba(62,207,178,0.5)" : "rgba(62,207,178,0.15)",
                background: data.subdomain === s ? "rgba(62,207,178,0.1)" : "transparent",
                color: data.subdomain === s ? "#3ECFB2" : "#7A9990",
              }}>
              {s}
            </button>
          ))}
        </div>
      </div>
      {/* Preview */}
      {data.subdomain && (
        <div className="flex items-center gap-3 p-4 rounded-xl" style={{ background: "rgba(62,207,178,0.05)", border: "1px solid rgba(62,207,178,0.1)" }}>
          <span className="text-sm" style={{ color: "#F0F5F3" }}>🌐</span>
          <span className="text-sm font-mono flex-1" style={{ color: "#3ECFB2" }}>
            https://{data.subdomain || "klinikangiz"}.dentaflow.uz
          </span>
          <button onClick={() => navigator.clipboard.writeText(`https://${data.subdomain}.dentaflow.uz`)}
            className="p-1.5 rounded-lg hover:bg-[rgba(62,207,178,0.1)] transition-colors" style={{ color: "#7A9990" }}>
            <Copy size={14} />
          </button>
        </div>
      )}
    </div>
  );
}

// ── Step 4: Tarif ──────────────────────────────────────────────────────────
function Step4({ data, onChange }: { data: FormData; onChange: (k: keyof FormData, v: string) => void }) {
  const plans: { id: FormData["plan"]; name: string; price: string; badge?: string; highlight: boolean; features: string[] }[] = [
    {
      id: "starter", name: "Starter", price: "299 000 so'm/oy", highlight: false,
      features: ["Website (1 til)", "Bemorlar CRM", "Navbat jadvali", "Telegram bot", "3 xodim"],
    },
    {
      id: "pro", name: "Pro", price: "599 000 so'm/oy", badge: "⭐ Ommabop", highlight: true,
      features: ["Website (3 til)", "Cheksiz bemorlar", "AI tibbiy PDF", "SMS eslatmalar", "Cheksiz xodim", "Hisobotlar"],
    },
    {
      id: "enterprise", name: "Enterprise", price: "Muzokarali", highlight: false,
      features: ["Multi-filial", "Custom domen", "API integratsiya", "24/7 qo'llab-quvvatlash"],
    },
  ];
  return (
    <div className="space-y-4">
      <p className="text-sm mb-6" style={{ color: "#7A9990" }}>14 kun bepul sinov. Karta talab etilmaydi.</p>
      {plans.map(({ id, name, price, badge, highlight, features }) => (
        <button key={id} onClick={() => onChange("plan", id!)}
          className="w-full text-left p-4 rounded-2xl transition-all border"
          style={{
            background: data.plan === id ? "rgba(62,207,178,0.08)" : "rgba(0,0,0,0.2)",
            borderColor: data.plan === id ? "rgba(62,207,178,0.5)" : highlight ? "rgba(62,207,178,0.2)" : "rgba(62,207,178,0.1)",
            boxShadow: data.plan === id ? "0 0 20px rgba(62,207,178,0.08)" : "none",
          }}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${data.plan === id ? "border-[#3ECFB2]" : "border-[#4a6e64]"}`}>
                {data.plan === id && <div className="w-2 h-2 rounded-full" style={{ background: "#3ECFB2" }} />}
              </div>
              <span className="font-bold" style={{ color: "#F0F5F3" }}>{name}</span>
              {badge && <span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: "rgba(62,207,178,0.2)", color: "#3ECFB2" }}>{badge}</span>}
            </div>
            <span className="text-sm font-semibold" style={{ color: data.plan === id ? "#3ECFB2" : "#7A9990" }}>{price}</span>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 ml-6">
            {features.map((f) => (
              <span key={f} className="text-xs flex items-center gap-1" style={{ color: "#7A9990" }}>
                <Check size={11} style={{ color: "#3ECFB2" }} />{f}
              </span>
            ))}
          </div>
        </button>
      ))}
    </div>
  );
}

// ── Step 5: Success ────────────────────────────────────────────────────────
function Step5({ data }: { data: FormData }) {
  const [copied, setCopied] = useState(false);
  const url = `https://${data.subdomain || "klinikangiz"}.dentaflow.uz`;
  const copy = () => { navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return (
    <div className="text-center space-y-6">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", bounce: 0.5, delay: 0.1 }}
        className="text-7xl">🎉</motion.div>
      <div>
        <h3 className="text-2xl font-bold mb-2" style={{ color: "#F0F5F3" }}>
          Klinikangiz tayyor!
        </h3>
        <p style={{ color: "#7A9990" }}>
          {data.clinicName || "Klinikangiz"} tizimga muvaffaqiyatli qo&apos;shildi.
        </p>
      </div>
      <div className="flex items-center gap-2 p-4 rounded-xl text-left"
        style={{ background: "rgba(62,207,178,0.05)", border: "1px solid rgba(62,207,178,0.15)" }}>
        <span className="font-mono text-sm flex-1" style={{ color: "#3ECFB2" }}>{url}</span>
        <button onClick={copy} className="p-1.5 rounded-lg transition-colors hover:bg-[rgba(62,207,178,0.1)]" style={{ color: "#7A9990" }}>
          {copied ? <Check size={14} style={{ color: "#3ECFB2" }} /> : <Copy size={14} />}
        </button>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <a href={url} target="_blank" rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all hover:scale-105"
          style={{ background: "#3ECFB2", color: "#050D0A" }}>
          Kirish <ArrowRight size={16} />
        </a>
        <a href="https://t.me/dentaflow_bot" target="_blank" rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm border transition-all hover:scale-105"
          style={{ borderColor: "rgba(62,207,178,0.3)", color: "#3ECFB2", background: "rgba(62,207,178,0.05)" }}>
          ✈️ Telegram kanaliga qo&apos;shiling
        </a>
      </div>
      <p className="text-xs" style={{ color: "#4a6e64" }}>
        Kirish ma&apos;lumotlari {data.email || "emailingizga"} yuborildi
      </p>
    </div>
  );
}

// ── PAGE ───────────────────────────────────────────────────────────────────
export default function BoshlashPage() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>({
    clinicName: "", phone: "", city: "", hours: "",
    fullName: "", email: "", password: "", confirmPassword: "",
    subdomain: "", plan: "",
  });

  function onChange(key: keyof FormData, value: string) {
    setForm((f) => {
      const next = { ...f, [key]: value };
      if (key === "clinicName" && !f.subdomain) {
        next.subdomain = toSlug(value);
      }
      return next;
    });
  }

  function canNext() {
    if (step === 0) return !!form.clinicName && !!form.phone;
    if (step === 1) return !!form.email && form.password.length >= 8 && form.password === form.confirmPassword;
    if (step === 2) return !!form.subdomain && form.subdomain.length >= 3;
    if (step === 3) return !!form.plan;
    return true;
  }

  function next() { if (canNext() && step < 4) setStep(step + 1); }
  function back() { if (step > 0) setStep(step - 1); }

  const stepsContent = [
    <Step1 key={0} data={form} onChange={onChange} />,
    <Step2 key={1} data={form} onChange={onChange} />,
    <Step3 key={2} data={form} onChange={onChange} />,
    <Step4 key={3} data={form} onChange={onChange} />,
    <Step5 key={4} data={form} />,
  ];

  const stepTitles = [
    "Klinika haqida",
    "Admin akkaunt yarating",
    "Subdomen tanlang",
    "Tarif tanlang",
    "Tayyor! 🎉",
  ];
  const stepSubs = [
    "Klinikangiz haqida asosiy ma'lumotlar",
    "Tizimga kirish uchun akkaunt",
    "Sizning manzil dentaflow.uz da",
    "14 kun bepul. Istalgan vaqt o'zgartirish mumkin.",
    "",
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5 py-16 relative"
      style={{ background: "#050D0A" }}>
      {/* BG gradient */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 30% 20%, rgba(62,207,178,0.05) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(124,58,237,0.06) 0%, transparent 60%)" }} />

      <div className="relative z-10 w-full max-w-lg">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 font-bold text-xl">
            <span className="text-2xl">🦷</span>
            <span style={{ color: "#3ECFB2" }}>DentaFlow</span>
          </Link>
          <p className="text-xs mt-1" style={{ color: "#4a6e64" }}>dentaflow.uz</p>
        </div>

        <div className="rounded-2xl p-6 sm:p-8"
          style={{ background: "rgba(12,23,20,0.8)", border: "1px solid rgba(62,207,178,0.12)", backdropFilter: "blur(16px)" }}>

          <StepBar step={step} />

          {/* Title */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles size={16} style={{ color: "#3ECFB2" }} />
              <h2 className="font-bold text-xl" style={{ color: "#F0F5F3" }}>{stepTitles[step]}</h2>
            </div>
            {stepSubs[step] && <p className="text-sm" style={{ color: "#7A9990" }}>{stepSubs[step]}</p>}
          </div>

          {/* Step content */}
          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}>
              {stepsContent[step]}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          {step < 4 && (
            <div className="flex items-center justify-between mt-8">
              {step > 0 ? (
                <button onClick={back} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm transition-colors hover:bg-[rgba(255,255,255,0.05)]"
                  style={{ color: "#7A9990" }}>
                  <ArrowLeft size={16} /> Orqaga
                </button>
              ) : (
                <Link href="/" className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm transition-colors hover:bg-[rgba(255,255,255,0.05)]"
                  style={{ color: "#7A9990" }}>
                  <ArrowLeft size={16} /> Ortga
                </Link>
              )}
              <button onClick={next} disabled={!canNext()}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
                style={{ background: "#3ECFB2", color: "#050D0A" }}>
                {step === 3 ? "Yakunlash" : "Davom etish"} <ArrowRight size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Footer note */}
        {step === 0 && (
          <p className="text-center mt-4 text-xs" style={{ color: "#4a6e64" }}>
            Allaqachon hisobingiz bormi?{" "}
            <a href="#" style={{ color: "#3ECFB2" }} className="hover:underline">Kirish</a>
          </p>
        )}
      </div>
    </div>
  );
}
