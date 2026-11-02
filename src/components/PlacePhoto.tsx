import { useEffect, useState } from "react";
import { photoFor, type Photo } from "../content/images";

/** A place's photo with its credit; renders nothing until one is found. */
export function PlacePhoto({ id, alt, className = "place-photo" }: { id: string; alt: string; className?: string }) {
  const [p, setP] = useState<Photo | null>(null);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    let live = true;
    setP(null); setLoaded(false);
    photoFor(id).then((x) => { if (live) setP(x); });
    return () => { live = false; };
  }, [id]);
  if (!p) return null;
  return (
    <figure className={className + (loaded ? " loaded" : "")}>
      <img src={p.src} alt={alt} loading="lazy" decoding="async" onLoad={() => setLoaded(true)} onError={() => setP(null)} referrerPolicy="no-referrer" />
      <figcaption>{p.link ? <a href={p.link} target="_blank" rel="noreferrer">{p.credit}</a> : p.credit} · preview image</figcaption>
    </figure>
  );
}
