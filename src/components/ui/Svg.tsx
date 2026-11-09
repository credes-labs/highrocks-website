import type { CSSProperties } from "react";

type SvgProps = {
  name: string;
  /** Intrinsic size of the SVG (its root width/height). */
  width: number;
  height: number;
  className?: string;
  style?: CSSProperties;
  alt?: string;
};

/**
 * Static SVG from /public/icons. SVGs gain nothing from next/image optimisation and are
 * routinely stretched or rotated by their wrappers, so a plain <img> is the right tool.
 */
export function Svg({ name, width, height, className, style, alt = "" }: SvgProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/icons/${name}.svg`}
      width={width}
      height={height}
      alt={alt}
      className={className}
      style={style}
      decoding="async"
    />
  );
}
