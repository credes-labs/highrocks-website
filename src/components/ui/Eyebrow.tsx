type EyebrowProps = {
  children: React.ReactNode;
  align?: "left" | "center";
  /** Width of the highlighted segment of the rule, in px. */
  fill?: number;
  className?: string;
};

/** Small uppercase label with a two-tone rule underneath ("EARLY ACCESS", "COMING SOON"). */
export function Eyebrow({ children, align = "left", fill = 317, className = "" }: EyebrowProps) {
  return (
    <div className={`flex w-full flex-col ${className}`}>
      <p
        className={`font-grotesk text-[16.694px] uppercase leading-[25px] tracking-[0.15em] text-accent ${
          align === "center" ? "text-center" : ""
        }`}
      >
        {children}
      </p>
      <div
        className={`flex h-[2.782px] w-full bg-line ${align === "center" ? "justify-center" : ""}`}
        aria-hidden
      >
        <div className="h-full bg-accent-deep" style={{ width: fill, maxWidth: "100%" }} />
      </div>
    </div>
  );
}
