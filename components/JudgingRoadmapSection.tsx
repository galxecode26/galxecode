"use client";

import { useState } from "react";
import {
  Award,
  AlertTriangle,
  Scale,
  Download,
  CheckCircle2,
  FileCode2,
  Layers,
  Sparkles,
  Timer,
  Users,
  Cpu,
  Trophy,
  ArrowRight,
  HelpCircle,
  BarChart3,
  Flame,
  ShieldAlert,
  GitBranch,
} from "lucide-react";

type StageKey = "stage1" | "stage2" | "stage3";

interface RubricItem {
  name: string;
  marks: number;
  focus: string;
  category: "core" | "tech" | "impact" | "presentation";
}

interface StageData {
  id: StageKey;
  number: string;
  title: string;
  subtitle: string;
  duration: string;
  advancement: string;
  weight: number;
  weightLabel: string;
  badgeColor: string;
  objective: string;
  submission: string;
  eliminationRules: string[];
  rubric: RubricItem[];
}

const STAGES: StageData[] = [
  {
    id: "stage1",
    number: "01",
    title: "Idea Screening & Feasibility",
    subtitle: "Problem framing & one-day hackathon viability",
    duration: "1–2 Hours",
    advancement: "Top 50% Advance (~20 teams from 40)",
    weight: 20,
    weightLabel: "20% of Final Score",
    badgeColor: "from-blue-500/20 to-cyan-500/20 border-cyan-500/40 text-cyan-300",
    objective:
      "Select ideas that are highly relevant, innovative, and realistically achievable within a single-day build window.",
    submission:
      "Problem statement, proposed solution, target users, tech stack, expected impact, and basic implementation roadmap.",
    eliminationRules: [
      "Top 50% highest-scoring teams advance to Stage 2.",
      "Impossible-to-prototype ideas during a single day will be rejected.",
      "Copied, duplicate, or unoriginal ideas will be disqualified.",
      "Missing mandatory deliverables results in immediate elimination.",
      "Tie-breaker at cutoff: Feasibility score → Innovation score → Judge consensus.",
    ],
    rubric: [
      {
        name: "Problem Relevance & Clarity",
        marks: 20,
        focus: "Real, specific, and clearly defined problem with verified user pain points.",
        category: "core",
      },
      {
        name: "Innovation / Originality",
        marks: 20,
        focus: "Novel approach, creative angle, or meaningful improvement over existing tools.",
        category: "impact",
      },
      {
        name: "One-Day Feasibility",
        marks: 20,
        focus: "Realistic possibility of shipping a working, demonstrable MVP in hackathon hours.",
        category: "core",
      },
      {
        name: "Technical Approach",
        marks: 15,
        focus: "Appropriate, modern, and technically sound architecture and technology selection.",
        category: "tech",
      },
      {
        name: "Potential Impact",
        marks: 15,
        focus: "Credible social, commercial, educational, or developer productivity value.",
        category: "impact",
      },
      {
        name: "Idea Presentation",
        marks: 10,
        focus: "Crisp, logical, structured, and confident communication of the concept.",
        category: "presentation",
      },
    ],
  },
  {
    id: "stage2",
    number: "02",
    title: "Prototype Development & Tech Evaluation",
    subtitle: "Conversion from concept to a functioning MVP",
    duration: "4–5 Hours",
    advancement: "Top 30–40% Proceed (6–8 Finalists)",
    weight: 30,
    weightLabel: "30% of Final Score",
    badgeColor: "from-purple-500/20 to-pink-500/20 border-purple-500/40 text-purple-300",
    objective:
      "Evaluate whether the team successfully converted their plan into a meaningful, working prototype with demonstrable core features.",
    submission:
      "Working codebase/repository, live prototype or local build execution, architecture breakdown, and implementation review.",
    eliminationRules: [
      "Top 30–40% strongest prototypes qualify as Grand Finalists.",
      "Teams must demonstrate at least a functional MVP / Proof-of-Concept.",
      "A strong idea with zero or non-working implementation will not beat a functional solution.",
      "Failure to submit the prototype before the deadline will lead to elimination.",
    ],
    rubric: [
      {
        name: "Working Prototype",
        marks: 25,
        focus: "Core feature functions live without fatal crashes and can be reliably demonstrated.",
        category: "core",
      },
      {
        name: "Technical Implementation",
        marks: 20,
        focus: "Effective use of software, AI/ML models, APIs, databases, or hardware integrations.",
        category: "tech",
      },
      {
        name: "Functionality & Features",
        marks: 15,
        focus: "Key promised functionalities from Stage 1 are genuinely implemented and operational.",
        category: "tech",
      },
      {
        name: "Innovation & Differentiation",
        marks: 15,
        focus: "Solution remains distinct, creative, and non-trivial in its implementation.",
        category: "impact",
      },
      {
        name: "User Experience / UI",
        marks: 10,
        focus: "Clean, usable, and intuitive user interface and smooth interaction flow.",
        category: "presentation",
      },
      {
        name: "Progress from Original Idea",
        marks: 10,
        focus: "Demonstrated velocity and strong execution against the Stage 1 roadmap.",
        category: "core",
      },
      {
        name: "Code Quality & Architecture",
        marks: 5,
        focus: "Reasonable repository structure, modularity, cleanliness, and maintainability.",
        category: "tech",
      },
    ],
  },
  {
    id: "stage3",
    number: "03",
    title: "Grand Finale Demo, Pitch & Defense",
    subtitle: "Live demo + Q&A defense before the grand jury",
    duration: "1–2 Hours",
    advancement: "Top 3 Podium Winners & Category Awards",
    weight: 50,
    weightLabel: "50% of Final Score (Highest Weight)",
    badgeColor: "from-amber-500/20 to-emerald-500/20 border-amber-500/40 text-amber-300",
    objective:
      "Stage 3 determines the ultimate champion through a live product demonstration, architecture defense, and deep Q&A session.",
    submission:
      "3–5 minute live presentation & working demo + 2–3 minute technical Q&A defense per team.",
    eliminationRules: [
      "Strict time-limit adherence: 3–5 min demo + 2–3 min Q&A.",
      "Final standings calculated using cumulative weighted scoring (20% + 30% + 50%).",
      "In case of a tie, the tie-breaker protocol is applied sequentially.",
    ],
    rubric: [
      {
        name: "Working Demonstration",
        marks: 25,
        focus: "Live prototype functions on stage and showcases the primary user journey flawlessly.",
        category: "core",
      },
      {
        name: "Problem & Solution Clarity",
        marks: 15,
        focus: "Target user, pain point, value proposition, and competitive advantage are razor-sharp.",
        category: "impact",
      },
      {
        name: "Technical Depth & Defense",
        marks: 15,
        focus: "Team demonstrates mastery of system architecture, AI pipelines, and design decisions.",
        category: "tech",
      },
      {
        name: "Innovation & Uniqueness",
        marks: 15,
        focus: "High degree of originality that sets the project apart from standard solutions.",
        category: "impact",
      },
      {
        name: "Real-World Impact",
        marks: 10,
        focus: "Practical, social, commercial, or institutional viability in the real world.",
        category: "impact",
      },
      {
        name: "Scalability & Future Potential",
        marks: 10,
        focus: "Clear roadmap for growth, API scaling, enterprise deployment, or startup transition.",
        category: "tech",
      },
      {
        name: "Presentation Quality & Q&A",
        marks: 10,
        focus: "Compelling storytelling, poise, and rapid, accurate responses during jury Q&A.",
        category: "presentation",
      },
    ],
  },
];

const TIE_BREAKERS = [
  { rank: "1st", title: "Higher Final-Stage Working Demonstration Score" },
  { rank: "2nd", title: "Higher Technical Depth & Architecture Score" },
  { rank: "3rd", title: "Higher Innovation & Originality Score" },
  { rank: "4th", title: "Higher Real-World Impact Score" },
  { rank: "5th", title: "Final Grand Jury Panel Consensus Vote" },
];

const DISQUALIFICATIONS = [
  "Plagiarism or substantial code copying without attribution",
  "Presenting a pre-built or previously completed project as new",
  "Misrepresentation of team contribution or individual work",
  "Deliberate interference or sabotage of another team's work",
  "Serious behavioral misconduct or violation of hackathon safety rules",
  "Failure to submit required code repositories or deliverables on time",
  "Use of restricted or prohibited resources in restricted tracks",
];

const SPECIAL_AWARDS = [
  { title: "Best Overall Solution", icon: Trophy, color: "from-amber-400 to-yellow-600" },
  { title: "Runner-Up Champion", icon: Award, color: "from-purple-400 to-indigo-600" },
  { title: "Second Runner-Up", icon: Award, color: "from-blue-400 to-cyan-600" },
  { title: "Best Innovation Award", icon: Sparkles, color: "from-fuchsia-400 to-pink-600" },
  { title: "Best AI/ML Solution", icon: Cpu, color: "from-emerald-400 to-teal-600" },
  { title: "Best Social Impact", icon: Users, color: "from-rose-400 to-red-600" },
  { title: "Best Technical Implementation", icon: FileCode2, color: "from-cyan-400 to-blue-600" },
];

export default function JudgingRoadmapSection() {
  const [activeStage, setActiveStage] = useState<StageKey>("stage1");

  // Calculator Simulator States
  const [s1Score, setS1Score] = useState<number>(80);
  const [s2Score, setS2Score] = useState<number>(85);
  const [s3Score, setS3Score] = useState<number>(90);

  const calculatedFinal = (s1Score * 0.2 + s2Score * 0.3 + s3Score * 0.5).toFixed(1);

  const currentStage = STAGES.find((s) => s.id === activeStage) || STAGES[0];

  return (
    <section
      id="judging"
      className="judging-section relative w-full py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10"
    >
      {/* Background Decorative Glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[900px] h-[550px] bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(147,51,234,0.1)_0%,transparent_70%)]" />
      </div>

      {/* Header */}
      <div className="text-center mb-16 relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono tracking-widest uppercase bg-purple-500/10 border border-purple-500/30 text-purple-300 mb-4 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
          <Scale size={14} className="text-purple-400" />
          <span>// EVALUATION MATRIX & ROADMAP</span>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-4">
          Judging Criteria &{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-300 to-cyan-400">
            Elimination Roadmap
          </span>
        </h2>

        <p className="max-w-3xl mx-auto text-base sm:text-lg text-zinc-300 leading-relaxed">
          A structured 3-stage single-day competition model designed for objective evaluation,
          merit-based elimination, and weighted final scores.
        </p>

        {/* Download Official PDF Link / Button */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
          <a
            href="/Detailed_Hackathon_Criteria.pdf"
            target="_blank"
            rel="noopener noreferrer"
            download
            className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 border border-purple-400/40 shadow-[0_0_20px_rgba(147,51,234,0.35)] transition-all hover:scale-105"
          >
            <Download size={16} />
            <span>Download Official Criteria PDF</span>
          </a>
          <a
            href="/Detailed_Hackathon_Criteria.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-mono text-zinc-400 hover:text-white border border-zinc-700/60 hover:border-purple-500/50 bg-black/40 backdrop-blur-sm transition-all"
          >
            <HelpCircle size={15} className="text-purple-400" />
            <span>View PDF in Browser</span>
          </a>
        </div>
      </div>

      {/* ROADMAP FUNNEL CARDS (3 Stages Overview) */}
      <div className="mb-14 grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        {STAGES.map((stage) => {
          const isActive = activeStage === stage.id;
          return (
            <button
              key={stage.id}
              onClick={() => setActiveStage(stage.id)}
              type="button"
              className={`group text-left relative flex flex-col justify-between p-6 sm:p-7 rounded-2xl border transition-all duration-300 ${
                isActive
                  ? "bg-gradient-to-b from-purple-900/40 via-zinc-950/90 to-zinc-950 border-purple-400 shadow-[0_0_35px_rgba(168,85,247,0.3)] scale-[1.02]"
                  : "bg-zinc-950/60 border-zinc-800 hover:border-purple-500/40 hover:bg-zinc-900/50"
              }`}
            >
              {/* Top Row: Stage number + Duration */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="flex items-center justify-center w-9 h-9 rounded-xl font-mono text-sm font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    S{stage.number}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs font-mono text-zinc-400 bg-zinc-900/80 px-2.5 py-1 rounded-full border border-zinc-800">
                    <Timer size={13} className="text-purple-400" />
                    <span>{stage.duration}</span>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white mb-1.5 group-hover:text-purple-200 transition-colors">
                  {stage.title}
                </h3>
                <p className="text-xs text-zinc-400 mb-4">{stage.subtitle}</p>
              </div>

              {/* Bottom Meta */}
              <div className="pt-4 border-t border-zinc-800/80 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-500 font-mono">Selection:</span>
                  <span className="text-emerald-300 font-medium">{stage.advancement}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-500 font-mono">Weight:</span>
                  <span className="text-purple-300 font-semibold">{stage.weightLabel}</span>
                </div>
              </div>

              {/* Active Indicator Pulse */}
              {isActive && (
                <div className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full bg-purple-400 shadow-[0_0_10px_#c084fc] animate-pulse" />
              )}
            </button>
          );
        })}
      </div>

      {/* DETAILED ACTIVE STAGE RUBRIC & ELIMINATION RULES */}
      <div className="relative z-10 rounded-2xl border border-purple-500/30 bg-zinc-950/80 p-6 sm:p-8 lg:p-10 backdrop-blur-xl shadow-[0_15px_40px_rgba(0,0,0,0.6)] mb-16">
        {/* Stage Header Banner */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 mb-8 border-b border-zinc-800/80">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 rounded-md text-xs font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                STAGE {currentStage.number} EVALUATION
              </span>
              <span className="text-xs font-mono text-zinc-400">Total: 100 Marks</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-white">{currentStage.title}</h3>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="px-4 py-2 rounded-xl bg-purple-950/40 border border-purple-500/30 text-right">
              <span className="block text-[10px] uppercase font-mono text-purple-300">Final Weight</span>
              <span className="text-lg font-bold text-white">{currentStage.weight}%</span>
            </div>
            <div className="px-4 py-2 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-right">
              <span className="block text-[10px] uppercase font-mono text-cyan-300">Selection Gate</span>
              <span className="text-sm font-semibold text-cyan-200">{currentStage.advancement}</span>
            </div>
          </div>
        </div>

        {/* Objective & Deliverables */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
            <span className="text-xs font-mono text-purple-400 uppercase tracking-wider block mb-1">
              🎯 Stage Objective
            </span>
            <p className="text-sm text-zinc-300">{currentStage.objective}</p>
          </div>
          <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider block mb-1">
              📦 Required Submission / Deliverable
            </span>
            <p className="text-sm text-zinc-300">{currentStage.submission}</p>
          </div>
        </div>

        {/* Scoring Rubric Breakdown Table/Cards */}
        <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <BarChart3 size={18} className="text-purple-400" />
          Scoring Rubric Breakdown (100 Marks)
        </h4>

        <div className="space-y-3 mb-10">
          {currentStage.rubric.map((item, idx) => (
            <div
              key={item.name}
              className="group p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/80 hover:border-purple-500/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-start sm:items-center gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-zinc-800 flex items-center justify-center font-mono text-xs text-zinc-400 font-bold group-hover:bg-purple-500/20 group-hover:text-purple-300 transition-colors">
                  {idx + 1}
                </span>
                <div>
                  <h5 className="text-sm sm:text-base font-semibold text-white group-hover:text-purple-200 transition-colors">
                    {item.name}
                  </h5>
                  <p className="text-xs text-zinc-400 leading-relaxed mt-0.5">{item.focus}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 sm:flex-shrink-0 self-end sm:self-center">
                <div className="w-24 sm:w-32 h-2 rounded-full bg-zinc-800 overflow-hidden hidden sm:block">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full"
                    style={{ width: `${(item.marks / 25) * 100}%` }}
                  />
                </div>
                <span className="px-3 py-1 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-300 font-mono text-xs sm:text-sm font-bold min-w-[75px] text-center">
                  {item.marks} Marks
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Elimination Rules Box */}
        <div className="p-5 rounded-xl bg-rose-950/20 border border-rose-500/30">
          <h5 className="text-sm font-bold text-rose-300 mb-3 flex items-center gap-2">
            <AlertTriangle size={16} className="text-rose-400" />
            Stage {currentStage.number} Elimination Protocol & Guardrails
          </h5>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-zinc-300">
            {currentStage.eliminationRules.map((rule) => (
              <li key={rule} className="flex items-start gap-2">
                <span className="text-rose-400 mt-0.5">•</span>
                <span>{rule}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* OVERALL WINNER CALCULATION & WEIGHTED SIMULATOR */}
      <div className="mb-16 relative z-10 rounded-2xl border border-purple-500/20 bg-zinc-950/60 p-6 sm:p-8 backdrop-blur-xl">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono text-cyan-300 bg-cyan-500/10 border border-cyan-500/30 mb-3">
            <Flame size={13} className="text-cyan-400" /> Cumulative Winner Formula
          </span>
          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            Weighted Score Calculation
          </h3>
          <p className="text-xs sm:text-sm text-zinc-400">
            The final winner is chosen based on overall performance, giving the heaviest emphasis to
            the final working solution (50%).
          </p>
        </div>

        {/* Formula Display Banner */}
        <div className="p-4 sm:p-6 rounded-xl bg-black/70 border border-purple-500/30 text-center mb-8 font-mono text-sm sm:text-base text-zinc-200">
          <span className="text-purple-400 font-bold">Final Score (100)</span> = (
          <span className="text-cyan-300 font-bold">Stage 1</span> × 0.20) + (
          <span className="text-purple-300 font-bold">Stage 2</span> × 0.30) + (
          <span className="text-amber-300 font-bold">Stage 3</span> × 0.50)
        </div>

        {/* Interactive Score Simulator */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
          {/* S1 Slider */}
          <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800">
            <div className="flex justify-between text-xs font-mono mb-2">
              <span className="text-cyan-300">Stage 1 (Idea)</span>
              <span className="text-white font-bold">{s1Score}/100</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={s1Score}
              onChange={(e) => setS1Score(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <span className="text-[10px] text-zinc-500 block mt-1">Weight: 20% (Contrib: {(s1Score * 0.2).toFixed(1)})</span>
          </div>

          {/* S2 Slider */}
          <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800">
            <div className="flex justify-between text-xs font-mono mb-2">
              <span className="text-purple-300">Stage 2 (Prototype)</span>
              <span className="text-white font-bold">{s2Score}/100</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={s2Score}
              onChange={(e) => setS2Score(Number(e.target.value))}
              className="w-full accent-purple-400 cursor-pointer"
            />
            <span className="text-[10px] text-zinc-500 block mt-1">Weight: 30% (Contrib: {(s2Score * 0.3).toFixed(1)})</span>
          </div>

          {/* S3 Slider */}
          <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800">
            <div className="flex justify-between text-xs font-mono mb-2">
              <span className="text-amber-300">Stage 3 (Final Demo)</span>
              <span className="text-white font-bold">{s3Score}/100</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={s3Score}
              onChange={(e) => setS3Score(Number(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer"
            />
            <span className="text-[10px] text-zinc-500 block mt-1">Weight: 50% (Contrib: {(s3Score * 0.5).toFixed(1)})</span>
          </div>

          {/* Calculated Output */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-900/60 to-indigo-950/80 border border-purple-400/50 text-center shadow-[0_0_25px_rgba(168,85,247,0.3)]">
            <span className="text-[11px] font-mono uppercase tracking-widest text-purple-300 block mb-1">
              Simulated Total
            </span>
            <div className="text-3xl sm:text-4xl font-extrabold text-white">
              {calculatedFinal}
              <span className="text-base text-zinc-400 font-normal"> / 100</span>
            </div>
            <span className="text-[10px] text-emerald-300 font-mono mt-1 block">
              Official PDF Example: 86.5
            </span>
          </div>
        </div>
      </div>

      {/* TIE-BREAKER RULES & DISQUALIFICATION CODES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16 relative z-10">
        {/* Tie Breaker Rules */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-6 sm:p-7 backdrop-blur-xl">
          <div className="flex items-center gap-2 mb-4">
            <Scale size={20} className="text-purple-400" />
            <h4 className="text-xl font-bold text-white">Official Tie-Breaker Protocol</h4>
          </div>
          <p className="text-xs text-zinc-400 mb-5">
            If two or more teams finish with equal weighted scores at the cutoff, the ranking is
            resolved using the following sequential hierarchy:
          </p>
          <div className="space-y-3">
            {TIE_BREAKERS.map((tb, idx) => (
              <div
                key={tb.title}
                className="flex items-center gap-3 p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80 text-xs sm:text-sm"
              >
                <span className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-300 font-mono font-bold flex items-center justify-center flex-shrink-0 text-xs">
                  {tb.rank}
                </span>
                <span className="text-zinc-200 font-medium">{tb.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Immediate Disqualification Conditions */}
        <div className="rounded-2xl border border-rose-500/20 bg-zinc-950/70 p-6 sm:p-7 backdrop-blur-xl">
          <div className="flex items-center gap-2 mb-4">
            <ShieldAlert size={20} className="text-rose-400" />
            <h4 className="text-xl font-bold text-white">Zero Tolerance Disqualifications</h4>
          </div>
          <p className="text-xs text-zinc-400 mb-5">
            Violation of any of the following conditions results in immediate disqualification and
            revocation of all prizes and certificates:
          </p>
          <div className="space-y-2.5">
            {DISQUALIFICATIONS.map((dq) => (
              <div
                key={dq}
                className="flex items-start gap-2.5 p-2.5 rounded-lg bg-rose-950/20 border border-rose-500/20 text-xs text-zinc-300"
              >
                <span className="text-rose-400 font-bold mt-0.5">✕</span>
                <span>{dq}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SPECIAL RECOGNITION AWARDS */}
      <div className="relative z-10">
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono text-amber-300 bg-amber-500/10 border border-amber-500/30 mb-2">
            <Trophy size={13} className="text-amber-400" /> Recommended Special Awards
          </span>
          <h3 className="text-2xl sm:text-3xl font-bold text-white">Award Categories</h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {SPECIAL_AWARDS.map((award) => {
            const Icon = award.icon;
            return (
              <div
                key={award.title}
                className="group p-4 rounded-xl border border-zinc-800 bg-zinc-950/60 hover:border-purple-500/40 hover:bg-zinc-900/50 transition-all duration-300 text-center flex flex-col items-center justify-center gap-2.5"
              >
                <div
                  className={`w-10 h-10 rounded-xl bg-gradient-to-br ${award.color} p-2 flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform`}
                >
                  <Icon size={20} />
                </div>
                <h5 className="text-xs sm:text-sm font-semibold text-white group-hover:text-purple-200 transition-colors">
                  {award.title}
                </h5>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
