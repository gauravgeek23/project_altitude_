/**
 * Stand-in for the Project Altitude badge in the Figma file (node 1:92). The real logo image
 * could not be downloaded from this environment; replace this component's contents with
 * <img src={logo} /> once the asset is in src/assets. It keeps the badge's 107 x 42 footprint.
 */
export function Logo() {
  return (
    <span className="logo" role="img" aria-label="Project Altitude">
      <svg width="22" height="16" viewBox="0 0 22 16" aria-hidden="true">
        <path d="M1 15 L8 4 L11.5 9 L14 6 L21 15 Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      </svg>
      <span className="logo-text"><b>PROJECT</b><b>ALTITUDE</b></span>
    </span>
  );
}
