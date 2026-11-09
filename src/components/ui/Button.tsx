import Link from "next/link";
import type { ComponentProps } from "react";

type Variant = "primary" | "light";

type CommonProps = { variant?: Variant; className?: string };
type AnchorProps = CommonProps & { href: string } & Omit<ComponentProps<"a">, "href" | "className">;
type NativeButtonProps = CommonProps & { href?: undefined } & Omit<ComponentProps<"button">, "className">;

const base =
  "inline-flex h-12 items-center justify-center whitespace-nowrap px-3 font-grotesk text-[12.691px] font-bold capitalize tracking-[0.1em] text-navy transition-[filter,transform] duration-200 hover:brightness-110 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-60";

const variants: Record<Variant, string> = {
  primary: "bg-accent",
  light: "bg-ink",
};

/** Renders an `<a>` when given an `href`, otherwise a `<button>`. */
export function Button(props: AnchorProps | NativeButtonProps) {
  const { variant = "primary", className = "", ...rest } = props;
  const cls = `${base} ${variants[variant]} ${className}`;

  if (rest.href !== undefined) {
    const anchor = rest as Omit<AnchorProps, "variant" | "className">;
    // Internal routes get client-side navigation; hashes and external URLs stay plain anchors.
    if (anchor.href.startsWith("/")) {
      return <Link {...anchor} href={anchor.href} className={cls} />;
    }
    return <a {...anchor} className={cls} />;
  }
  return (
    <button type="button" {...(rest as Omit<NativeButtonProps, "variant" | "className">)} className={cls} />
  );
}
