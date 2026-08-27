"use client";

import TerminalRevealText from "./TerminalRevealText";

const ELIGIBILITY_CHECKS = [
  {
    key: "who",
    value: "all_students",
    desc: "Undergraduate & postgraduate students — any stream, any branch, any year.",
  },
  {
    key: "team_size",
    value: "2-4_members",
    desc: "Form your squad. Cross-college and cross-domain teams are welcome.",
  },
  {
    key: "experience",
    value: "not_required",
    desc: "No prior hackathon experience needed. If you can ideate, you can build.",
  },
  {
    key: "location",
    value: "",
    desc: "Register online, build remotely, pitch live on demo day.",
  },
];

export default function EligibilitySection() {
  return (
    <section id="eligibility" className="eligibility-section">
      <div className="text-center">
        <p className="section-tag">// ELIGIBILITY</p>
        <h2 className="eligibility-title">
          <TerminalRevealText />
        </h2>
        <p className="eligibility-subtitle">
          Run a quick check — see if GalxeCode &apos;26 is built for you.
        </p>
      </div>

      <div className="terminal-window">
        <div className="terminal-header">
          <span className="terminal-dot dot-red" />
          <span className="terminal-dot dot-yellow" />
          <span className="terminal-dot dot-green" />
          <span className="terminal-tab">galxe@code — eligibility.sh</span>
        </div>

        <div className="terminal-body">
          <p className="terminal-line terminal-cmd">
            <span className="terminal-prompt">$</span> ./check_eligibility.sh --galxecode
          </p>

          {ELIGIBILITY_CHECKS.map((item) => (
            <div key={item.key} className="terminal-entry">
              <span className="terminal-check">✓</span>
              <div className="terminal-entry-content">
                <p className="terminal-line">
                  <span className="terminal-key">{item.key}</span>
                  <span className="terminal-separator">=</span>
                  <span className="terminal-value">{item.value}</span>
                </p>
                <p className="terminal-comment"># {item.desc}</p>
              </div>
            </div>
          ))}

          <div className="terminal-divider" />

          <p className="terminal-line terminal-result">
            <span className="terminal-prompt">$</span> status:{" "}
            <span className="terminal-status-ok">ELIGIBLE ✓</span>
            <span className="terminal-caret" />
          </p>
        </div>
      </div>
    </section>
  );
}
