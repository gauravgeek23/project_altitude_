import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { photoDate, type Photo } from "../content/images";

/** Full-screen photo viewer: left/right arrows, keyboard arrows, swipe, thumbnails, Esc to close. */
export function Lightbox({ photos, start = 0, alt, onClose }: { photos: Photo[]; start?: number; alt: string; onClose(): void }) {
  const n = photos.length;
  const [i, setI] = useState(Math.min(start, n - 1));
  const go = (d: number) => setI((x) => (x + d + n) % n);
  const touch = useRef<number | null>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", key);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeBtn.current?.focus();
    return () => { window.removeEventListener("keydown", key); document.body.style.overflow = prev; };
  }, [n]);
  // have the neighbours ready before they are asked for
  useEffect(() => {
    for (const k of [i + 1, i - 1]) { const p = photos[(k + n) % n]; if (p) new Image().src = p.src; }
  }, [i, n]);
  const p = photos[i];
  return createPortal(
    <div className="lightbox" role="dialog" aria-modal="true" aria-label={`${alt}, photo ${i + 1} of ${n}`}
      onClick={(e) => { if (e.target === e.currentTarget || (e.target as Element).tagName === "FIGURE") onClose(); }}
      onTouchStart={(e) => { touch.current = e.touches[0].clientX; }}
      onTouchEnd={(e) => { if (touch.current == null) return; const dx = e.changedTouches[0].clientX - touch.current; if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1); touch.current = null; }}>
      <figure><img key={p.src} src={p.src} alt={p.caption || `${alt} (${i + 1} of ${n})`} referrerPolicy="no-referrer" /></figure>
      <div className="lb-bar">
        <div className="lb-text">
          {p.caption && <b>{p.caption}</b>}
          <span>{photoDate(p)} · {p.credit}{n > 1 && ` · ${i + 1} / ${n}`}</span>
        </div>
        {n > 1 && (
          <div className="lb-thumbs">{photos.map((t, k) => (
            <img key={t.thumb} src={t.thumb} alt="" className={k === i ? "on" : undefined} onClick={() => setI(k)} referrerPolicy="no-referrer" />
          ))}</div>
        )}
      </div>
      <button ref={closeBtn} type="button" className="lb-close" onClick={onClose} aria-label="Close">✕</button>
      {n > 1 && <button type="button" className="lb-prev" onClick={() => go(-1)} aria-label="Previous photo">‹</button>}
      {n > 1 && <button type="button" className="lb-next" onClick={() => go(1)} aria-label="Next photo">›</button>}
    </div>,
    document.body,
  );
}
