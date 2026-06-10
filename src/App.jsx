import { useState, useEffect, useRef } from "react";
import { QUESTIONS, scoreAndRank, getArchetype, getArchetypeKey } from "./data.js";
import MapView from "./MapView.jsx";

/* ─────────────────────────────────────────────
   ARCHETYPE ICONS  (inline SVG, white stroke)
───────────────────────────────────────────── */
function IconElevated() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L4 18h16L12 2z" />
      <path d="M8 18v4M16 18v4" opacity=".4" />
    </svg>
  );
}
function IconPowerBroker() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <line x1="12" y1="3" x2="12" y2="21" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <circle cx="12" cy="12" r="2.5" fill="currentColor" stroke="none" />
    </svg>
  );
}
function IconDowntownNative() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2C8.134 2 5 5.134 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.866-3.134-7-7-7z" />
      <circle cx="12" cy="9" r="2.5" fill="currentColor" stroke="none" />
    </svg>
  );
}
function IconModernist() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 2L4 14h7l-2 8 9-12h-7l2-8z" />
    </svg>
  );
}

const ARCHETYPE_ICONS = {
  elevated: <IconElevated />,
  powerbroker: <IconPowerBroker />,
  downtownnative: <IconDowntownNative />,
  modernist: <IconModernist />,
};

/* ─────────────────────────────────────────────
   SHARED ATOMS
───────────────────────────────────────────── */
function Logo({ light = false }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${light ? "bg-white/10 border border-white/20" : "bg-[#1B3A6B]/10 border border-[#1B3A6B]/15"}`}>
        <svg className={`w-4 h-4 ${light ? "text-white" : "text-[#1B3A6B]"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      </div>
      <span className={`font-semibold tracking-widest text-xs uppercase ${light ? "text-white" : "text-[#1B3A6B]"}`}>VryfID</span>
    </div>
  );
}

function Toast({ visible }) {
  return (
    <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-[#1B3A6B] text-white shadow-2xl transition-all duration-500 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}>
      <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <span className="text-sm font-medium">Message sent to listing agent <span className="text-white/50">(demo)</span></span>
    </div>
  );
}

/* ─────────────────────────────────────────────
   INTRO
───────────────────────────────────────────── */
function IntroView({ onStart }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#1B3A6B] relative overflow-hidden">
      {/* dot grid */}
      <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "30px 30px" }} />
      {/* bottom dark fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#0D2144] to-transparent" />

      <div className="relative flex-1 flex flex-col max-w-3xl mx-auto w-full px-6 py-12">
        <Logo light />

        <div className="flex-1 flex flex-col justify-center py-16 text-center">
          <div className="inline-flex items-center gap-2 justify-center mb-7">
            <div className="h-px w-8 bg-white/20" />
            <span className="text-[#93C5FD] text-[10px] font-semibold uppercase tracking-[0.25em]">Manhattan · Home Type Quiz</span>
            <div className="h-px w-8 bg-white/20" />
          </div>

          <h1 className="font-serif text-white text-5xl md:text-[4rem] leading-[1.06] mb-6">
            Your home says
            <br />
            <em className="not-italic text-[#BFDBFE]">everything about you.</em>
          </h1>

          <p className="text-white/50 text-lg font-light leading-relaxed max-w-md mx-auto mb-12">
            Three questions. One Manhattan type. Your matched address — waiting.
          </p>

          <div className="flex flex-col items-center gap-3">
            <button
              onClick={onStart}
              className="inline-flex items-center gap-2.5 px-9 py-4 bg-white text-[#1B3A6B] rounded-full font-semibold text-sm hover:bg-[#DBEAFE] active:scale-[0.97] transition-all duration-200 shadow-lg shadow-black/20"
            >
              Discover My Type
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <p className="text-white/25 text-xs">8 verified listings · takes 30 seconds</p>
          </div>
        </div>

        {/* stat strip */}
        <div className="border-t border-white/10 pt-6 flex justify-center gap-10">
          {[["4", "Manhattan types"], ["8", "curated listings"], ["30s", "to your match"]].map(([v, l]) => (
            <div key={l} className="text-center">
              <p className="text-white font-semibold text-xl">{v}</p>
              <p className="text-white/30 text-xs mt-0.5">{l}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   QUESTION
───────────────────────────────────────────── */
function QuestionView({ question, questionIndex, total, answers, onAnswer, onBack }) {
  const letters = ["A", "B", "C", "D"];
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2]">
      {/* nav */}
      <div className="max-w-2xl mx-auto w-full px-6 pt-8 flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-1.5 text-slate-400 hover:text-[#1B3A6B] text-sm transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        {/* progress pills */}
        <div className="flex gap-1.5 items-center">
          {Array.from({ length: total }).map((_, i) => (
            <div key={i} className={`h-1 rounded-full transition-all duration-300 ${i < questionIndex ? "w-5 bg-[#1B3A6B]" : i === questionIndex ? "w-9 bg-[#1B3A6B]" : "w-3 bg-[#E0D9D0]"}`} />
          ))}
        </div>
        <span className="text-slate-400 text-xs w-10 text-right">{questionIndex + 1}/{total}</span>
      </div>

      {/* content */}
      <div className="flex-1 flex flex-col justify-center max-w-2xl mx-auto w-full px-6 py-12">
        <p className="text-[#1B3A6B]/40 text-[11px] font-semibold uppercase tracking-[0.22em] mb-5">
          Question {questionIndex + 1} of {total}
        </p>
        <h2 className="font-serif text-[#1B3A6B] text-[2.5rem] leading-tight mb-10">
          {question.question}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {question.options.map((opt, i) => {
            const selected = answers[question.id] === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => onAnswer(question.id, opt.value)}
                className={`group relative text-left px-5 py-4 rounded-2xl border-2 transition-all duration-200 active:scale-[0.98] ${selected ? "border-[#1B3A6B] bg-[#1B3A6B]" : "border-[#E0D9D0] bg-white hover:border-[#1B3A6B]"}`}
              >
                {/* letter badge */}
                <span className={`absolute top-3.5 right-4 text-[11px] font-semibold ${selected ? "text-white/30" : "text-slate-200 group-hover:text-slate-300"}`}>
                  {letters[i]}
                </span>
                <p className={`font-semibold text-sm leading-snug ${selected ? "text-white" : "text-[#1B3A6B]"}`}>
                  {opt.label}
                </p>
                {opt.sub && (
                  <p className={`text-xs mt-0.5 ${selected ? "text-white/60" : "text-slate-400"}`}>
                    {opt.sub}
                  </p>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   ANALYZING  (fake loading for drama)
───────────────────────────────────────────── */
const ANALYZING_PHASES = [
  "Reading your answers…",
  "Mapping Manhattan types…",
  "Your type is ready.",
];

function AnalyzingView({ onDone }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 700);
    const t2 = setTimeout(() => setPhase(2), 1400);
    const t3 = setTimeout(() => onDone(), 2200);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onDone]);

  return (
    <div className="min-h-screen bg-[#0D2144] flex items-center justify-center">
      <div className="text-center px-6">
        {/* pulsing shield */}
        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-10"
          style={{ animation: "pulse 1.6s ease-in-out infinite" }}>
          <svg className="w-7 h-7 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>

        <p key={phase} className="font-serif text-white text-2xl md:text-3xl mb-8"
          style={{ animation: "fadeSlideUp .4s cubic-bezier(.16,1,.3,1) both" }}>
          {ANALYZING_PHASES[phase]}
        </p>

        {/* progress dots */}
        <div className="flex gap-2 justify-center">
          {ANALYZING_PHASES.map((_, i) => (
            <div key={i} className={`rounded-full transition-all duration-400 ${i <= phase ? "w-6 h-1 bg-white" : "w-2 h-1 bg-white/20"}`} />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: .6; transform: scale(.94); }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

/* ─────────────────────────────────────────────
   ARCHETYPE REVEAL CARD  (the viral moment)
───────────────────────────────────────────── */
function ArchetypeCard({ archetypeKey, archetype, match, onScrollDown }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    const text = `I'm ${archetype.name} — my Manhattan home type.\n\n"${archetype.tagline}"\n\nFind yours at vryfid.com`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  }

  return (
    <div className="relative overflow-hidden bg-[#0D2144] min-h-[92vh] flex flex-col">
      {/* dot grid */}
      <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "28px 28px" }} />
      {/* top-right glow */}
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#2A5298] opacity-20 blur-3xl pointer-events-none" />

      {/* nav */}
      <div className="relative z-10 max-w-4xl mx-auto w-full px-6 pt-6 flex items-center justify-between">
        <Logo light />
        <button onClick={onScrollDown} className="flex items-center gap-1.5 text-white/40 hover:text-white/70 text-xs transition-colors">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
          skip to listing
        </button>
      </div>

      {/* main content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center max-w-3xl mx-auto w-full px-6 py-12">
        {/* icon ring */}
        <div className="w-16 h-16 rounded-2xl border border-white/15 bg-white/5 flex items-center justify-center text-white mb-8"
          style={{ animation: "fadeSlideUp .4s cubic-bezier(.16,1,.3,1) both" }}>
          {ARCHETYPE_ICONS[archetypeKey]}
        </div>

        {/* YOU ARE label */}
        <p className="text-white/35 text-[10px] font-semibold uppercase tracking-[0.28em] mb-4"
          style={{ animation: "fadeSlideUp .45s .05s cubic-bezier(.16,1,.3,1) both" }}>
          You are
        </p>

        {/* NAME — the big moment */}
        <h2 className="font-serif text-white text-[3.2rem] md:text-[4.5rem] leading-[1.0] mb-5"
          style={{ animation: "fadeSlideUp .5s .1s cubic-bezier(.16,1,.3,1) both" }}>
          {archetype.name}
        </h2>

        {/* tagline */}
        <p className="text-[#93C5FD] text-lg md:text-xl font-light italic leading-snug max-w-lg mb-6"
          style={{ animation: "fadeSlideUp .5s .18s cubic-bezier(.16,1,.3,1) both" }}>
          "{archetype.tagline}"
        </p>

        {/* description */}
        <p className="text-white/55 text-base font-light leading-relaxed max-w-md mb-10"
          style={{ animation: "fadeSlideUp .5s .25s cubic-bezier(.16,1,.3,1) both" }}>
          {archetype.description}
        </p>

        {/* match preview line */}
        <div className="flex items-center gap-2 mb-10 px-4 py-2.5 rounded-full border border-white/10 bg-white/5"
          style={{ animation: "fadeSlideUp .5s .32s cubic-bezier(.16,1,.3,1) both" }}>
          <svg className="w-3.5 h-3.5 text-[#93C5FD]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 2C8.134 2 5 5.134 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.866-3.134-7-7-7z" />
          </svg>
          <span className="text-white/50 text-xs">Your match —</span>
          <span className="text-white text-xs font-semibold">{match.street}</span>
          <span className="text-white/30 text-xs">{match.neighborhood}</span>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 items-center"
          style={{ animation: "fadeSlideUp .5s .38s cubic-bezier(.16,1,.3,1) both" }}>
          <button
            onClick={handleCopy}
            className={`flex items-center gap-2 px-6 py-3 rounded-full border text-sm font-semibold transition-all duration-200 ${copied ? "bg-white text-[#1B3A6B] border-white" : "bg-white/8 text-white border-white/20 hover:bg-white/15"}`}
          >
            {copied ? (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Copied — share it
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy your type
              </>
            )}
          </button>

          <button
            onClick={onScrollDown}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-white text-[#1B3A6B] text-sm font-semibold hover:bg-[#DBEAFE] active:scale-[0.97] transition-all duration-200"
          >
            See your match
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

/* ─────────────────────────────────────────────
   RESULTS  (listing + map section)
───────────────────────────────────────────── */
function AlsoConsiderCard({ listing, rank }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-[#E8E0D5] flex gap-4 items-start">
      <div className="flex-shrink-0 w-9 h-9 rounded-full bg-[#FAF7F2] border border-[#E8E0D5] flex items-center justify-center">
        <span className="text-[#1B3A6B] text-xs font-semibold">#{rank}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[#1B3A6B] font-semibold text-sm truncate">{listing.street}</p>
        <p className="text-slate-400 text-xs mt-0.5 mb-2">{listing.neighborhood} · {listing.unit}</p>
        <div className="flex items-center justify-between">
          <span className="text-[#1B3A6B] font-semibold text-sm">{listing.price}<span className="text-slate-400 font-normal text-xs">/mo</span></span>
          <span className="text-slate-400 text-xs">{listing.beds} bd · {listing.sqft} sf</span>
        </div>
        <div className="flex flex-wrap gap-1 mt-2">
          {listing.tags.slice(0, 2).map((t) => (
            <span key={t} className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#DBEAFE] text-[#1B3A6B]">{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function ListingSection({ ranked, message, onMessageChange, onSend, onStartOver, toast, detailsRef }) {
  const match = ranked[0];
  if (!match) return null;

  return (
    <div className="bg-[#FAF7F2]" ref={detailsRef}>
      {/* sticky mini nav */}
      <div className="bg-white border-b border-[#E8E0D5] sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo />
            <span className="text-[#E8E0D5]">·</span>
            <span className="text-slate-400 text-sm hidden sm:block">{match.street}</span>
          </div>
          <button onClick={onStartOver} className="flex items-center gap-1.5 text-slate-400 hover:text-[#1B3A6B] text-sm transition-colors">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Retake quiz
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* map */}
        <div className="mb-6">
          <MapView listing={match} />
        </div>

        {/* details + message */}
        <div className="grid md:grid-cols-5 gap-5 mb-10">
          {/* listing card */}
          <div className="md:col-span-3 bg-white rounded-2xl p-7 border border-[#E8E0D5] shadow-sm">
            <div className="flex items-start justify-between mb-5">
              <div>
                <p className="text-[#1B3A6B] text-[11px] font-semibold uppercase tracking-widest mb-1">{match.neighborhood} · {match.unit}</p>
                <h3 className="font-serif text-[#1B3A6B] text-3xl">{match.street}</h3>
                <p className="text-slate-400 text-sm mt-1">{match.city}</p>
              </div>
              <div className="flex flex-col items-end gap-1.5 flex-shrink-0 ml-4">
                {match.tags.map((t) => (
                  <span key={t} className="px-2.5 py-1 rounded-full text-xs font-medium bg-[#DBEAFE] text-[#1B3A6B] whitespace-nowrap">{t}</span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-6">
              {[["Beds", match.beds], ["Baths", match.baths], ["Sq Ft", match.sqft]].map(([label, val]) => (
                <div key={label} className="bg-[#FAF7F2] rounded-xl p-3 text-center">
                  <p className="text-[#1B3A6B] font-semibold text-xl leading-none mb-1">{val}</p>
                  <p className="text-slate-400 text-[11px] uppercase tracking-wide">{label}</p>
                </div>
              ))}
            </div>

            <div className="flex items-baseline gap-1.5 mb-5">
              <span className="font-serif text-[#1B3A6B] text-2xl">{match.price}</span>
              <span className="text-slate-400 text-sm">{match.period}</span>
            </div>

            <p className="text-slate-600 text-sm leading-relaxed">{match.description}</p>
          </div>

          {/* message card */}
          <div className="md:col-span-2 bg-white rounded-2xl p-6 border border-[#E8E0D5] shadow-sm flex flex-col">
            <div className="flex items-center gap-3 mb-5 pb-5 border-b border-[#F0EAE0]">
              <div className="w-10 h-10 rounded-full bg-[#1B3A6B] flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                {match.agent.split(" ").map((n) => n[0]).join("")}
              </div>
              <div>
                <p className="text-[#1B3A6B] font-semibold text-sm">{match.agent}</p>
                <p className="text-slate-400 text-xs">{match.agentTitle}</p>
              </div>
              <div className="ml-auto flex items-center gap-1.5 flex-shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="text-emerald-600 text-xs font-medium">Online</span>
              </div>
            </div>

            <p className="text-[#1B3A6B] font-semibold text-sm mb-1">Message About This Listing</p>
            <p className="text-slate-400 text-xs mb-4">Schedule a tour, ask questions, or request details.</p>

            <textarea
              value={message}
              onChange={(e) => onMessageChange(e.target.value)}
              placeholder={`Hi ${match.agent.split(" ")[0]}, I'd love to learn more about ${match.street}…`}
              rows={5}
              className="flex-1 w-full resize-none rounded-xl border border-[#E8E0D5] bg-[#FAF7F2] px-4 py-3 text-sm text-[#1B3A6B] placeholder:text-slate-300 outline-none focus:border-[#93C5FD] focus:ring-2 focus:ring-[#DBEAFE] transition-all duration-200"
            />

            <button
              onClick={onSend}
              disabled={!message.trim()}
              className="mt-3 w-full py-3 rounded-xl text-sm font-semibold bg-[#1B3A6B] text-white hover:bg-[#0D2144] active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
            >
              Send Message
            </button>
            <p className="text-center text-slate-300 text-[11px] mt-3">VryfID connects verified renters only</p>
          </div>
        </div>

        {/* also consider */}
        {ranked.length > 1 && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <h3 className="font-serif text-[#1B3A6B] text-2xl">Also Consider</h3>
              <div className="flex-1 h-px bg-[#E8E0D5]" />
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {ranked.slice(1, 4).map((l, i) => (
                <AlsoConsiderCard key={l.id} listing={l} rank={i + 2} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* footer */}
      <footer className="border-t border-[#E8E0D5] mt-4">
        <div className="max-w-5xl mx-auto px-6 py-7 flex flex-col md:flex-row items-center justify-between gap-3">
          <Logo />
          <p className="text-slate-300 text-xs">Product concept demo · All listings and pricing are illustrative.</p>
        </div>
      </footer>

      <Toast visible={toast} />
    </div>
  );
}

/* ─────────────────────────────────────────────
   ROOT
───────────────────────────────────────────── */
export default function App() {
  const [step, setStep] = useState("intro");
  const [answers, setAnswers] = useState({});
  const [ranked, setRanked] = useState([]);
  const [archetype, setArchetype] = useState(null);
  const [archetypeKey, setArchetypeKey] = useState(null);
  const [message, setMessage] = useState("");
  const [toast, setToast] = useState(false);
  const detailsRef = useRef(null);

  function handleAnswer(questionId, value) {
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);

    const qIndex = QUESTIONS.findIndex((q) => q.id === questionId);
    if (qIndex < QUESTIONS.length - 1) {
      setStep(qIndex + 1);
    } else {
      // Last question answered — pre-compute, then show analyzing
      const results = scoreAndRank(newAnswers);
      const key = getArchetypeKey(newAnswers.location);
      setRanked(results);
      setArchetype(getArchetype(newAnswers.location));
      setArchetypeKey(key);
      setStep("analyzing");
    }
  }

  function handleSend() {
    if (!message.trim()) return;
    setToast(true);
    setMessage("");
    setTimeout(() => setToast(false), 4000);
  }

  function startOver() {
    setStep("intro");
    setAnswers({});
    setRanked([]);
    setArchetype(null);
    setArchetypeKey(null);
    setMessage("");
    setToast(false);
  }

  function scrollToDetails() {
    setTimeout(() => {
      detailsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] font-sans">
      {step === "intro" && <IntroView onStart={() => setStep(0)} />}

      {typeof step === "number" && (
        <QuestionView
          question={QUESTIONS[step]}
          questionIndex={step}
          total={QUESTIONS.length}
          answers={answers}
          onAnswer={handleAnswer}
          onBack={() => (step > 0 ? setStep(step - 1) : setStep("intro"))}
        />
      )}

      {step === "analyzing" && (
        <AnalyzingView onDone={() => setStep("results")} />
      )}

      {step === "results" && archetype && (
        <>
          <ArchetypeCard
            archetypeKey={archetypeKey}
            archetype={archetype}
            match={ranked[0]}
            onScrollDown={scrollToDetails}
          />
          <ListingSection
            ranked={ranked}
            message={message}
            onMessageChange={setMessage}
            onSend={handleSend}
            onStartOver={startOver}
            toast={toast}
            detailsRef={detailsRef}
          />
        </>
      )}
    </div>
  );
}
