import { useState } from "react";
import { photoDate, photosFor } from "../content/images";
import { Lightbox } from "./Lightbox";

/**
 * One photo of a place (the lead one, or the one at `index`) with a count of the others.
 * A click opens all of the place's photos full screen. Renders nothing for a place without photos.
 */
export function PlacePhoto({ id, alt, index = 0, className = "place-photo" }: { id: string; alt: string; index?: number; className?: string }) {
  const photos = photosFor(id);
  const [open, setOpen] = useState<number | null>(null);
  const [loaded, setLoaded] = useState(false);
  const p = photos[index];
  if (!p) return null;
  const show = () => setOpen(index);
  const n = photos.length;
  return (
    <>
      <figure className={className + (loaded ? " loaded" : "")}>
        <img src={p.thumb} alt={p.caption || alt} width={p.w} height={p.h} loading="lazy" decoding="async" referrerPolicy="no-referrer"
          onLoad={() => setLoaded(true)} onClick={show} role="button" tabIndex={0}
          aria-label={`${alt}: open ${n} photo${n > 1 ? "s" : ""} full screen`}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); show(); } }} />
        {n > 1 && <span className="count">{n} photos</span>}
        <figcaption>{p.caption ? `${p.caption} · ` : ""}{photoDate(p)}</figcaption>
      </figure>
      {open != null && <Lightbox photos={photos} start={open} alt={alt} onClose={() => setOpen(null)} />}
    </>
  );
}
