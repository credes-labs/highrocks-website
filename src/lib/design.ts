/** One Figma design pixel, scaled with the viewport (see --d in globals.css). */
export const d = (n: number) => `calc(${n} * var(--d))`;

/** Page gutter: little, tasteful padding so type can take the full width. */
export const gutter = "px-4 sm:px-6 lg:px-8";
