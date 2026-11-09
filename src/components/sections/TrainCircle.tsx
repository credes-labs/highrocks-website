"use client";

import Image from "next/image";
import { useState, type CSSProperties } from "react";
import "./TrainCircle.css";

const stations = [
  { id: "run-out", name: "Running", metric: "8 kms", image: "/images/polaroid-run.png", icon: "run" },
  { id: "sled", name: "Sled Push", metric: "12.5 m", image: "/images/polaroid-sled.png", icon: "sled" },
  { id: "endurance", name: "Endurance", metric: "\u2014", image: "/images/journey/endurance.webp", icon: "mountain" },
  { id: "run-back", name: "Running", metric: "8 kms", image: "/images/polaroid-run.png", icon: "run" },
  { id: "wallballs", name: "Wall Balls", metric: "100 r", image: "/images/polaroid-wallballs.png", icon: "target" },
  { id: "nutrition", name: "Nutrition", metric: "\u2014", image: "/images/journey/nutrition.webp", icon: "nutrition" },
];

function StationIcon({ type }: { type: string }) {
  return <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {type === "run" && <><circle cx="26" cy="6" r="2.5" fill="currentColor" /><path d="m13 13 7-4 7 7 6-3M21 12l-6 10 8 3-4 10M16 22l-6 10H5M8 16l4-5M5 23l5-2" strokeWidth="2.2" /></>}
    {type === "sled" && <><ellipse cx="20" cy="12" rx="15" ry="4" /><path d="M5 12v5c0 5 30 5 30 0v-5M5 19v5c0 5 30 5 30 0v-5M5 26v5c0 5 30 5 30 0v-5" /></>}
    {type === "mountain" && <><path d="m3 33 12-23 7 12 5-17 11 28H3Z" /><path d="m11 18 5 4 3-4m5-4 4 5 3-3" /></>}
    {type === "target" && <><circle cx="20" cy="20" r="16" /><circle cx="20" cy="20" r="11" /><circle cx="20" cy="20" r="6" /><circle cx="20" cy="20" r="1" /></>}
    {type === "nutrition" && <><path d="M8 5v10c0 5 9 5 9 0V5M12.5 5v30M26 5c-7 6-8 15 0 15h3M29 5v30" /></>}
  </svg>;
}

export function TrainCircle() {
  const [chapter, setChapter] = useState(1);
  return (
    <section id="info-centre" className="journey" aria-labelledby="journey-heading" aria-roledescription="carousel">
      <div className="journey-canvas">
        <div className="journey-grid" aria-hidden="true" />
        <header className="journey-header">
          <div className="journey-label"><svg viewBox="0 0 28 28" aria-hidden="true">{[[6,5],[14,7],[23,4],[20,13],[12,17],[5,24],[21,23]].map(([x,y], i)=><circle key={i} cx={x} cy={y} r="2" fill="currentColor" />)}</svg><span>The journey</span></div>
          <span className="journey-header-line" aria-hidden="true" />
          <div className="journey-controls">
            <span className="journey-counter" aria-live="polite" aria-atomic="true">0{chapter + 1}<span>/03</span></span>
            <button type="button" aria-label="Previous journey chapter" onClick={() => setChapter((chapter + 2) % 3)}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 5-7 7 7 7" /></svg></button>
            <button type="button" aria-label="Next journey chapter" onClick={() => setChapter((chapter + 1) % 3)}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 7 7-7 7" /></svg></button>
          </div>
        </header>
        <div className="journey-orbit" aria-hidden="true">
          <svg viewBox="0 0 1000 1000" preserveAspectRatio="none"><ellipse cx="500" cy="500" rx="498" ry="498" /><ellipse className="journey-inner-orbit" cx="500" cy="500" rx="402" ry="402" />{[44,132,225,315].map(deg=><path key={deg} d="m494 1 6 12 6-12Z" transform={`rotate(${deg} 500 500)`} className="journey-direction" />)}</svg>
        </div>
        <div className="journey-copy">
          <h2 id="journey-heading">Train In <span>Full Circle.</span></h2>
          <p className="journey-subtitle">From Training To<br />Nutrition &amp; Recovery</p>
          <span className="journey-copy-rule" aria-hidden="true" />
          <p className="journey-description">A complete ecosystem to help you<br className="journey-desktop-break" /> perform, recover and grow.</p>
        </div>
        <span className="journey-cross journey-cross-left" aria-hidden="true" /><span className="journey-cross journey-cross-right" aria-hidden="true" /><span className="journey-cross journey-cross-top" aria-hidden="true" />
        <ul className="journey-stations" aria-label="Training, nutrition and recovery">
          {stations.map((station, index) => {
            const position = (index + (chapter - 1) * 2 + 6) % 6;
            return <li key={station.id} className={`journey-station journey-position-${position}`} style={{ "--station-order": index } as CSSProperties}>
              <article className="journey-card">
                <Image src={station.image} alt="" fill sizes="(max-width: 600px) 200px, (max-width: 1000px) 230px, 340px" className="journey-card-image" />
                <div className="journey-card-shade" />
                <div className="journey-card-caption"><StationIcon type={station.icon} /><div><h3>{station.name}</h3><p>{station.metric}</p></div></div>
              </article>
              <span className="journey-node" aria-hidden="true" />
            </li>;
          })}
        </ul>
        <footer className="journey-footer"><span>Train / Fuel / Recover / Repeat</span><span className="journey-footer-line" aria-hidden="true" /><span>Higher. Stronger. Longer.</span></footer>
      </div>
    </section>
  );
}
