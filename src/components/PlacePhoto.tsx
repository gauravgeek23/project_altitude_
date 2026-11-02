import { useEffect, useState } from "react";
import { galleryFor, photoFor, type Photo } from "../content/images";
import { Lightbox } from "./Lightbox";

/** A place's photo with its credit; renders nothing until one is found. A click opens the gallery. */
/** `query` is what the search sources look for, e.g. "Pangong Tso Ladakh"; it defaults to the alt text. */
export function PlacePhoto({ id, alt, query, className = "place-photo" }: { id: string; alt: string; query?: string; className?: string }) {
  const q = query ?? alt;
  const [p, setP] = useState<Photo | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [gallery, setGallery] = useState<Photo[] | null>(null);
  useEffect(() => {
    let live = true;
    setP(null); setLoaded(false); setGallery(null);
    photoFor(id, q).then((x) => { if (live) setP(x); });
    return () => { live = false; };
  }, [id, q]);
  if (!p) return null;
  const open = () => { setGallery([p]); galleryFor(id, p, q).then((g) => setGallery((cur) => (cur ? g : cur))); };
  return (
    <>
      <figure className={className + (loaded ? " loaded" : "")}>
        <img src={p.src} alt={alt} loading="lazy" decoding="async" onLoad={() => setLoaded(true)} onError={() => setP(null)} referrerPolicy="no-referrer"
          onClick={open} role="button" tabIndex={0} aria-label={`${alt}: open photos full screen`}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } }} />
        <figcaption>{p.link ? <a href={p.link} target="_blank" rel="noreferrer">{p.credit}</a> : p.credit} · preview image</figcaption>
      </figure>
      {gallery && <Lightbox photos={gallery} alt={alt} onClose={() => setGallery(null)} />}
    </>
  );
}
