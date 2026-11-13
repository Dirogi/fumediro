import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";

type Variant = "primary" | "secondary";

const base =
  "inline-flex min-h-11 min-w-11 items-center justify-center rounded-full px-6 text-sm font-medium " +
  "transition-[transform,background-color] duration-150 ease-out active:scale-[0.97]";

const variants: Record<Variant, string> = {
  primary: "bg-champagne text-charcoal hover:bg-ivory",
  secondary: "glass-panel text-ivory hover:bg-graphite",
};

type ButtonProps = { variant?: Variant } & (
  | ({ href: string } & Omit<ComponentPropsWithoutRef<typeof Link>, "href">)
  | ({ href?: undefined } & ComponentPropsWithoutRef<"button">)
);

export function GlassButton({ variant = "primary", className = "", ...props }: ButtonProps) {
  const cls = `${base} ${variants[variant]} ${className}`;
  if (props.href !== undefined) return <Link {...props} className={cls} />;
  return <button type="button" {...props} className={cls} />;
}
