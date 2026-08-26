"use client";

import { useState, useEffect, useRef } from "react";

const FULL_TEXT = "{GalxeCode`26 \n Hackathon}";
const CHARS = FULL_TEXT.split("");
const NEWLINE_INDEX = FULL_TEXT.indexOf("\n");
const TYPING_SPEED = 60;

export default function TypewriterHeadline() {
  const [charCount, setCharCount] = useState(0);
  const [done, setDone] = useState(false);
  const countRef = useRef(0);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    let interval: ReturnType<typeof setInterval>;

    const startTyping = () => {
      countRef.current = 0;
      setDone(false);
      setCharCount(0);

      interval = setInterval(() => {
        countRef.current += 1;
        if (countRef.current >= CHARS.length) {
          clearInterval(interval);
          setCharCount(CHARS.length);
          setDone(true);
          timeout = setTimeout(startTyping, 3000);
          return;
        }
        setCharCount(countRef.current);
      }, TYPING_SPEED);
    };

    startTyping();

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  const visibleChars = CHARS.slice(0, charCount);
  let line1 = "";
  let line2 = "";
  let onLine2 = false;
  for (const ch of visibleChars) {
    if (ch === "\n") {
      onLine2 = true;
    } else if (onLine2) {
      line2 += ch;
    } else {
      line1 += ch;
    }
  }

  const showCursor1 = !done && charCount > 0 && charCount <= NEWLINE_INDEX;
  const showCursor2 = !done && charCount > NEWLINE_INDEX + 1;

  return (
    <div className="headline">
      <span className="headline-line">
        {line1.length > 0 && (
          <>
            {line1[0] === "{" ? (
              <span className="bracket">{"{"}</span>
            ) : null}
            <span className={done ? "shimmer-text" : undefined}>
              {line1[0] === "{" ? line1.slice(1) : line1}
            </span>
          </>
        )}
        {showCursor1 && <span className="cursor">|</span>}
      </span>
      <span className="headline-line">
        {line2.length > 0 && (
          <>
            <span className={done ? "shimmer-text" : undefined}>
              {line2.endsWith("}") ? line2.slice(0, -1) : line2}
            </span>
            {line2.endsWith("}") ? (
              <span className="bracket">{"}"}</span>
            ) : null}
          </>
        )}
        {showCursor2 && <span className="cursor">|</span>}
      </span>
    </div>
  );
}
