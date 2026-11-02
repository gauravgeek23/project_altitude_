import { useState } from "react";
import { photoDate, photosFor } from "../content/images";
import { Lightbox } from "./Lightbox";

/**
 * One photo of a place (the lead one, or the one at `index`) with a count of the others.
 * A click opens all of the place's photos full screen (not when `interactive` is false: then the click goes to
 * whatever holds the photo, such as a closed card). `caption` false leaves the picture bare (a thumbnail).
 * Renders nothing for a place without photos.
 */
export function PlacePhoto({ id, alt, index = 0, className = "place-photo", interactive = true, caption = true }:
  { id: string; alt: string; index?: number; className?: string; interactive?: boolean; caption?: boolean }) {
  const photos = photosFor(id);
  const [open, setOpen] = useState<number | null>(null);
  const [loaded, setLoaded] = useState(false);
  const p = photos[index];
  if (!p) return null;
  const show = () => setOpen(index);
  const n = photos.length;
  return (
    <>
      <figure className={className + (loaded ? " loaded" : "") + (interactive ? "" : " static")}>
        <img src={p.thumb} alt={p.caption || alt} width={p.w} height={p.h} loading="lazy" decoding="async" referrerPolicy="no-referrer"
          onLoad={() => setLoaded(true)}
          {...(interactive ? {
            onClick: show, role: "button" as const, tabIndex: 0, "aria-label": `${alt}: open ${n} photo${n > 1 ? "s" : ""} full screen`,
            onKeyDown: (e: React.KeyboardEvent) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); show(); } },
          } : {})} />
        {caption && n > 1 && <span className="count">{n} photos</span>}
        {caption && <figcaption>{p.caption ? `${p.caption} · ` : ""}{photoDate(p)}</figcaption>}
      </figure>
      {open != null && <Lightbox photos={photos} start={open} alt={alt} onClose={() => setOpen(null)} />}
    </>
  );
}
