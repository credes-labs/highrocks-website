"use client";

import { useEffect, useRef, useState } from "react";
import { formatTotal, type PaceConfig, type SplitResult } from "@/lib/pacing/engine";
import { renderShareCard } from "./shareCard";

/** Modal that renders the branded PNG card, previews it, and offers download or the native share sheet. */
export function ShareCardDialog({ plan, config, onClose }: { plan: SplitResult; config: PaceConfig; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [blob, setBlob] = useState<Blob | null>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const name = `highrocks-plan-${formatTotal(plan.finalTime).replace(/:/g, "-")}.png`;

  // Open as a modal once mounted. No close() in cleanup: the element unmounts with the component,
  // and closing would fire onClose (and unmount it) under React's development double-run of effects.
  useEffect(() => {
    if (ref.current && !ref.current.open) ref.current.showModal();
  }, []);

  useEffect(() => {
    let objectUrl: string | null = null;
    let cancelled = false;
    renderShareCard(plan, config, window.location.host)
      .then((canvas) => new Promise<Blob | null>((res) => canvas.toBlob(res, "image/png")))
      .then((b) => {
        if (cancelled) return;
        if (!b) throw new Error("toBlob failed");
        objectUrl = URL.createObjectURL(b);
        setBlob(b);
        setUrl(objectUrl);
      })
      .catch(() => !cancelled && setError(true));
    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [plan, config]);

  const file = blob ? new File([blob], name, { type: "image/png" }) : null;
  const canShare = Boolean(file && typeof navigator !== "undefined" && navigator.canShare?.({ files: [file] }));

  const share = async () => {
    if (!file) return;
    try {
      await navigator.share({ files: [file], title: "My Hyrox race plan", text: `Projected finish ${formatTotal(plan.finalTime)} · HighRocks` });
    } catch {
      /* dismissed */
    }
  };

  return (
    <dialog ref={ref} className="pc-dialog" onClose={onClose} onClick={(e) => e.target === ref.current && onClose()} aria-labelledby="pc-dialog-title">
      <div className="pc-dialog-body">
        <header>
          <h2 id="pc-dialog-title">Your share card</h2>
          <button type="button" onClick={onClose} aria-label="Close">
            ×
          </button>
        </header>
        <div className="pc-card-frame">
          {url ? (
            // eslint-disable-next-line @next/next/no-img-element -- a local blob: URL generated in the browser
            <img src={url} width={1080} height={1920} alt={`HighRocks race plan card: projected finish ${formatTotal(plan.finalTime)}`} />
          ) : (
            <p>{error ? "Sorry, the card could not be created in this browser." : "Drawing your card…"}</p>
          )}
        </div>
        <p className="pc-small">1080 × 1920 PNG, sized for Instagram and WhatsApp stories.</p>
        <div className="pc-dialog-actions">
          {url && (
            <a className="pc-primary" href={url} download={name}>
              Download PNG <span aria-hidden="true">↓</span>
            </a>
          )}
          {canShare && (
            <button type="button" className="pc-secondary" onClick={share}>
              Share…
            </button>
          )}
        </div>
      </div>
    </dialog>
  );
}
