import { LOGOMARK_PATHS } from "@/lib/logomark";

function Mark({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 264 263" aria-hidden>
      {LOGOMARK_PATHS.map((d) => (
        <path key={d.slice(0, 16)} d={d} fill="currentColor" />
      ))}
    </svg>
  );
}

/** Admin login / large logo. */
export function Logo() {
  return (
    <span className="hr-logo">
      <Mark size={44} />
      <span>HighRocks</span>
    </span>
  );
}

/** Admin nav icon. */
export function Icon() {
  return <Mark size={22} />;
}
