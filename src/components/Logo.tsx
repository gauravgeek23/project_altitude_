import logo from "../assets/logo.png";

/** Project Altitude badge (Figma node 1:92), 107 x 42, supplied at 2x for sharp screens. */
export function Logo() {
  return <img className="logo" src={logo} width={107} height={42} alt="Project Altitude" />;
}
