import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { Photo } from "../content/images";

/** Full-screen photo viewer with left/right browsing, keyboard arrows, swipe and thumbnails. */
export function Lightbox({ photos, start = 0, alt, onClose }: { photos: Photo[]; start?: number; alt: string; onClose(): void }) {
  const [i, setI] = useState(start);
  const n = photos.length;
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
  useEffect(() => { if (i >= n) setI(0); }, [n]);
  const p = photos[Math.min(i, n - 1)];
  return createPortal(
    <div className="lightbox" role="dialog" aria-modal="true" aria-label={`${alt}, photo ${i + 1} of ${n}`}
      onClick={(e) => { if (e.target === e.currentTarget || (e.target as Element).tagName === "FIGURE") onClose(); }}
      onTouchStart={(e) => { touch.current = e.touches[0].clientX; }}
      onTouchEnd={(e) => { if (touch.current == null) return; const dx = e.changedTouches[0].clientX - touch.current; if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1); touch.current = null; }}>
      <figure><img key={p.src} src={p.src} alt={`${alt} (${i + 1} of ${n})`} referrerPolicy="no-referrer" /></figure>
      <div className="lb-bar">
        {n > 1 && <span>{i + 1} / {n}</span>}
        {n > 1 && (
          <div className="lb-thumbs">{photos.map((t, k) => (
            <img key={t.src} src={t.src} alt="" className={k === i ? "on" : undefined} onClick={() => setI(k)} referrerPolicy="no-referrer" />
          ))}</div>
        )}
        <span>{p.link ? <a href={p.link} target="_blank" rel="noreferrer">{p.credit}</a> : p.credit} · preview image</span>
      </div>
      <button ref={closeBtn} type="button" className="lb-close" onClick={onClose} aria-label="Close">✕</button>
      {n > 1 && <button type="button" className="lb-prev" onClick={() => go(-1)} aria-label="Previous photo">‹</button>}
      {n > 1 && <button type="button" className="lb-next" onClick={() => go(1)} aria-label="Next photo">›</button>}
    </div>,
    document.body,
  );
}
