import { useState } from "react";
import { QUESTIONS, scoreAndRank } from "./data.js";
import MapView from "./MapView.jsx";

/* ─────────────────────────────────────────────
   SHARED ATOMS
───────────────────────────────────────────── */

function Logo({ light = false }) {
  return (
    <div className="flex items-center gap-2.5">
      <div
        className={`w-7 h-7 rounded-lg flex items-center justify-center ${
          light
            ? "bg-white/10 border border-white/20"
            : "bg-[#1B3A6B]/10 border border-[#1B3A6B]/20"
        }`}
      >
        <svg
          className={`w-4 h-4 ${light ? "text-white" : "text-[#1B3A6B]"}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
      </div>
      <span
        className={`font-semibold tracking-widest text-xs uppercase ${
          light ? "text-white" : "text-[#1B3A6B]"
        }`}
      >
        VryfID
      </span>
    </div>
  );
}

function Toast({ visible }) {
  return (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-[#1B3A6B] text-white shadow-2xl transition-all duration-500 ${
        visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
        <svg
          className="w-3.5 h-3.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <span className="text-sm font-medium">
        Message sent to listing agent{" "}
        <span className="text-white/50">(demo)</span>
      </span>
    </div>
  );
}

/* ─────────────────────────────────────────────
   INTRO
───────────────────────────────────────────── */

function IntroView({ onStart }) {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="relative overflow-hidden bg-[#1B3A6B] flex-1 flex flex-col">
        {/* dot grid */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "30px 30px",
          }}
        />
        {/* bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0D2144] to-transparent" />

        <div className="relative flex-1 flex flex-col max-w-3xl mx-auto w-full px-6 py-12">
          <Logo light />

          <div className="flex-1 flex flex-col justify-center py-16 text-center">
            <p className="text-[#93C5FD] text-[11px] font-semibold uppercase tracking-[0.22em] mb-6">
              Manhattan · Agent-Matched Living
            </p>
            <h1 className="font-serif text-white text-5xl md:text-6xl leading-[1.08] mb-6">
              Three questions.
              <br />
              <em className="not-italic text-[#BFDBFE]">Your perfect apartment.</em>
            </h1>
            <p className="text-white/55 text-lg font-light leading-relaxed max-w-md mx-auto mb-12">
              Answer three simple questions and our matching engine will surface
              the Manhattan residence built around your life.
            </p>

            <div className="flex flex-col items-center gap-4">
              <button
                onClick={onStart}
                className="inline-flex items-center gap-2.5 px-8 py-4 bg-white text-[#1B3A6B] rounded-full font-semibold text-sm hover:bg-[#DBEAFE] active:scale-[0.97] transition-all duration-200 shadow-lg"
              >
                Find My Match
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
              <p className="text-white/25 text-xs">
                8 verified listings · No signup required
              </p>
            </div>
          </div>

          {/* stats strip */}
          <div className="border-t border-white/10 pt-6 flex justify-center gap-10">
            {[
              ["340+", "Verified Listings"],
              ["98%", "Match Accuracy"],
              ["2.1 days", "Avg. to Lease"],
            ].map(([v, l]) => (
              <div key={l} className="text-center">
                <p className="text-white font-semibold text-lg">{v}</p>
                <p className="text-white/35 text-xs mt-0.5">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   QUESTION
───────────────────────────────────────────── */

function QuestionView({ question, questionIndex, total, answers, onAnswer, onBack }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2]">
      {/* top bar */}
      <div className="max-w-2xl mx-auto w-full px-6 pt-8 flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-slate-400 hover:text-[#1B3A6B] text-sm transition-colors duration-150"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back
        </button>

        {/* progress */}
        <div className="flex gap-1.5 items-center">
          {Array.from({ length: total }).map((_, i) => (
            <div
              key={i}
              className={`h-1 rounded-full transition-all duration-400 ${
                i < questionIndex
                  ? "w-6 bg-[#1B3A6B]"
                  : i === questionIndex
                  ? "w-10 bg-[#1B3A6B]"
                  : "w-4 bg-[#E8E0D5]"
              }`}
            />
          ))}
        </div>

        <span className="text-slate-400 text-xs w-12 text-right">
          {questionIndex + 1} / {total}
        </span>
      </div>

      {/* question */}
      <div className="flex-1 flex flex-col justify-center max-w-2xl mx-auto w-full px-6 py-12">
        <p className="text-[#1B3A6B]/50 text-[11px] font-semibold uppercase tracking-[0.2em] mb-5">
          Question {questionIndex + 1}
        </p>
        <h2 className="font-serif text-[#1B3A6B] text-4xl md:text-[2.75rem] leading-tight mb-10">
          {question.question}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {question.options.map((opt) => {
            const selected = answers[question.id] === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => onAnswer(question.id, opt.value)}
                className={`
                  text-left px-5 py-4 rounded-2xl border-2 transition-all duration-200
                  active:scale-[0.98]
                  ${
                    selected
                      ? "border-[#1B3A6B] bg-[#1B3A6B]"
                      : "border-[#E0D9D0] bg-white hover:border-[#1B3A6B]"
                  }
                `}
              >
                <p
                  className={`font-semibold text-sm leading-snug ${
                    selected ? "text-white" : "text-[#1B3A6B]"
                  }`}
                >
                  {opt.label}
                </p>
                {opt.sub && (
                  <p
                    className={`text-xs mt-0.5 ${
                      selected ? "text-white/65" : "text-slate-400"
                    }`}
                  >
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
   RESULTS
───────────────────────────────────────────── */

function AlsoConsiderCard({ listing, rank }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-[#E8E0D5] flex gap-4 items-start">
      <div className="flex-shrink-0 w-9 h-9 rounded-full bg-[#FAF7F2] border border-[#E8E0D5] flex items-center justify-center">
        <span className="text-[#1B3A6B] text-xs font-semibold">#{rank}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[#1B3A6B] font-semibold text-sm leading-tight truncate">
          {listing.street}
        </p>
        <p className="text-slate-400 text-xs mt-0.5 mb-2.5">
          {listing.neighborhood} · {listing.unit}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-[#1B3A6B] font-semibold text-sm">
            {listing.price}
            <span className="text-slate-400 font-normal text-xs">/mo</span>
          </span>
          <span className="text-slate-400 text-xs">
            {listing.beds} bd · {listing.baths} ba · {listing.sqft} sf
          </span>
        </div>
        <div className="flex flex-wrap gap-1 mt-2.5">
          {listing.tags.slice(0, 2).map((t) => (
            <span
              key={t}
              className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#DBEAFE] text-[#1B3A6B]"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function ResultsView({ ranked, message, onMessageChange, onSend, onStartOver, toast }) {
  const match = ranked[0];
  if (!match) return null;

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      {/* top bar */}
      <div className="bg-white border-b border-[#E8E0D5] sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Logo />
          <button
            onClick={onStartOver}
            className="flex items-center gap-1.5 text-slate-400 hover:text-[#1B3A6B] text-sm transition-colors duration-150"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Start over
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* match headline */}
        <div
          className="mb-8"
          style={{ animation: "fadeSlideUp .45s cubic-bezier(.16,1,.3,1) both" }}
        >
          <div className="flex items-center gap-2.5 mb-3">
            <span className="px-3 py-1 rounded-full bg-[#1B3A6B] text-white text-[11px] font-semibold tracking-wide">
              #1 Match
            </span>
            <span className="text-slate-400 text-sm">Based on your answers</span>
          </div>
          <h2 className="font-serif text-[#1B3A6B] text-4xl md:text-5xl leading-tight">
            {match.street}
          </h2>
          <p className="text-slate-500 mt-1.5">
            {match.neighborhood} · {match.city}
          </p>
        </div>

        {/* map */}
        <div
          className="mb-6"
          style={{
            animation: "fadeSlideUp .5s .08s cubic-bezier(.16,1,.3,1) both",
          }}
        >
          <MapView lat={match.lat} lng={match.lng} />
        </div>

        {/* details + message */}
        <div
          className="grid md:grid-cols-5 gap-5 mb-10"
          style={{
            animation: "fadeSlideUp .5s .15s cubic-bezier(.16,1,.3,1) both",
          }}
        >
          {/* listing card */}
          <div className="md:col-span-3 bg-white rounded-2xl p-7 border border-[#E8E0D5] shadow-sm">
            <div className="flex items-start justify-between mb-5">
              <div>
                <p className="text-[#1B3A6B] text-[11px] font-semibold uppercase tracking-widest mb-1">
                  {match.unit}
                </p>
                <div className="flex items-baseline gap-1.5">
                  <span className="font-serif text-[#1B3A6B] text-3xl">
                    {match.price}
                  </span>
                  <span className="text-slate-400 text-sm">{match.period}</span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1.5">
                {match.tags.map((t) => (
                  <span
                    key={t}
                    className="px-2.5 py-1 rounded-full text-xs font-medium bg-[#DBEAFE] text-[#1B3A6B] whitespace-nowrap"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                ["Beds", match.beds],
                ["Baths", match.baths],
                ["Sq Ft", match.sqft],
              ].map(([label, val]) => (
                <div
                  key={label}
                  className="bg-[#FAF7F2] rounded-xl p-3 text-center"
                >
                  <p className="text-[#1B3A6B] font-semibold text-xl leading-none mb-1">
                    {val}
                  </p>
                  <p className="text-slate-400 text-[11px] uppercase tracking-wide">
                    {label}
                  </p>
                </div>
              ))}
            </div>

            <p className="text-slate-600 text-sm leading-relaxed">
              {match.description}
            </p>
          </div>

          {/* message card */}
          <div className="md:col-span-2 bg-white rounded-2xl p-6 border border-[#E8E0D5] shadow-sm flex flex-col">
            {/* agent */}
            <div className="flex items-center gap-3 mb-5 pb-5 border-b border-[#F0EAE0]">
              <div className="w-10 h-10 rounded-full bg-[#1B3A6B] flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                {match.agent
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div>
                <p className="text-[#1B3A6B] font-semibold text-sm">
                  {match.agent}
                </p>
                <p className="text-slate-400 text-xs">{match.agentTitle}</p>
              </div>
              <div className="ml-auto flex items-center gap-1.5 flex-shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="text-emerald-600 text-xs font-medium">
                  Online
                </span>
              </div>
            </div>

            <p className="text-[#1B3A6B] font-semibold text-sm mb-1">
              Message About This Listing
            </p>
            <p className="text-slate-400 text-xs mb-4">
              Schedule a tour, ask questions, or request more details.
            </p>

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

            <p className="text-center text-slate-300 text-[11px] mt-3">
              VryfID connects verified renters only
            </p>
          </div>
        </div>

        {/* also consider */}
        {ranked.length > 1 && (
          <div
            style={{
              animation: "fadeSlideUp .5s .22s cubic-bezier(.16,1,.3,1) both",
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <h3 className="font-serif text-[#1B3A6B] text-2xl">
                Also Consider
              </h3>
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
      <footer className="border-t border-[#E8E0D5] mt-6">
        <div className="max-w-5xl mx-auto px-6 py-7 flex flex-col md:flex-row items-center justify-between gap-3">
          <Logo />
          <p className="text-slate-300 text-xs">
            Product concept demo · All listings and pricing are illustrative.
          </p>
        </div>
      </footer>

      <Toast visible={toast} />

      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

/* ─────────────────────────────────────────────
   ROOT
───────────────────────────────────────────── */

export default function App() {
  const [step, setStep] = useState("intro"); // "intro" | 0 | 1 | 2 | "results"
  const [answers, setAnswers] = useState({});
  const [ranked, setRanked] = useState([]);
  const [message, setMessage] = useState("");
  const [toast, setToast] = useState(false);

  function handleAnswer(questionId, value) {
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);

    const qIndex = QUESTIONS.findIndex((q) => q.id === questionId);
    if (qIndex < QUESTIONS.length - 1) {
      setStep(qIndex + 1);
    } else {
      setRanked(scoreAndRank(newAnswers));
      setStep("results");
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
    setMessage("");
    setToast(false);
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

      {step === "results" && (
        <ResultsView
          ranked={ranked}
          message={message}
          onMessageChange={setMessage}
          onSend={handleSend}
          onStartOver={startOver}
          toast={toast}
        />
      )}
    </div>
  );
}
