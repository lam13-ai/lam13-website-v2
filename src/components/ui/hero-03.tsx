/**
 * Hero03 — adapted for this Vite + Tailwind 3.4 project:
 * - `motion/react` → `framer-motion` (same API, package already installed)
 * - `react-wrap-balancer` → CSS `text-balance` (no extra dependency)
 * - Tailwind v4 mask-* utilities → arbitrary-value CSS mask
 * - CTA helper implemented inline on top of the existing shadcn Button
 */
import * as React from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";

import { cn } from "@/lib/utils";
import { Button, type ButtonProps } from "@/components/ui/button";

export interface CtaProps {
  ctaEnabled?: boolean;
  text?: string;
  link?: string;
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
}

function Cta({ cta }: Readonly<{ cta: CtaProps }>) {
  return (
    <Button asChild variant={cta.variant ?? "default"} size={cta.size ?? "default"}>
      <a href={cta.link || "#"}>{cta.text}</a>
    </Button>
  );
}

export interface Hero03Props {
  title: string;
  description: string;
  portraitImage: string;
  portraitAlt?: string;
  animation?: "none" | "subtle";
  primaryCTA: CtaProps;
  secondaryCTA?: CtaProps;
  variant?: "standard" | "compact";
}

const variantStyles = {
  standard: {
    section: "py-20 sm:py-28",
    title: "text-3xl sm:text-4xl md:text-5xl",
    description: "mx-auto max-w-lg text-sm sm:text-base leading-relaxed",
    header: "gap-5",
    content: "gap-14 sm:gap-20",
    portrait: "max-w-3xl",
  },
  compact: {
    section: "py-14 sm:py-20",
    title: "text-2xl sm:text-3xl md:text-4xl",
    description: "mx-auto max-w-md text-sm leading-relaxed",
    header: "gap-4",
    content: "gap-10 sm:gap-14",
    portrait: "max-w-2xl",
  },
} as const;

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 12, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

const mediaItem: Variants = {
  hidden: { opacity: 0, y: 24, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

function Reveal({
  active,
  variants,
  className,
  children,
}: Readonly<{
  active: boolean;
  variants?: Variants;
  className?: string;
  children: React.ReactNode;
}>) {
  if (!active) return <div className={className}>{children}</div>;

  return (
    <motion.div variants={variants ?? item} className={className}>
      {children}
    </motion.div>
  );
}

export function Hero03({
  title,
  description,
  portraitImage,
  portraitAlt = "",
  animation = "none",
  primaryCTA,
  secondaryCTA,
  variant = "standard",
}: Readonly<Hero03Props>) {
  const reduce = useReducedMotion();
  const animate = animation === "subtle" && !reduce;
  const vs = variantStyles[variant];

  const titleElement = title && (
    <h1 className={cn("text-foreground font-display font-normal tracking-tight text-balance", vs.title)}>
      {title}
    </h1>
  );

  const descriptionElement = description && (
    <p className={cn("text-muted-foreground text-balance", vs.description)}>{description}</p>
  );

  const ctasElement = (primaryCTA?.ctaEnabled || secondaryCTA?.ctaEnabled) && (
    <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3">
      {primaryCTA?.ctaEnabled && <Cta cta={primaryCTA} />}
      {secondaryCTA?.ctaEnabled && <Cta cta={{ ...secondaryCTA, variant: secondaryCTA.variant ?? "link" }} />}
    </div>
  );

  const mediaElement = portraitImage && (
    <div className={cn("relative mx-auto w-full", vs.portrait)}>
      <div
        className="relative z-10 mx-auto w-full overflow-hidden [mask-image:radial-gradient(80%_70%_at_center,#000_70%,transparent_100%)]"
      >
        <div
          aria-hidden
          className="bg-background/25 pointer-events-none absolute inset-0 mix-blend-overlay"
        />
        <img
          src={portraitImage}
          alt={portraitAlt}
          decoding="async"
          className="relative aspect-[5/4] w-full object-cover object-[center_15%]"
        />
      </div>
    </div>
  );

  return (
    <section className="bg-background relative isolate w-full overflow-hidden">
      <motion.div
        className={cn("relative z-10 mx-auto flex max-w-6xl flex-col px-6", vs.section, vs.content)}
        variants={animate ? container : undefined}
        initial={animate ? "hidden" : false}
        whileInView={animate ? "visible" : undefined}
        viewport={{ once: true, margin: "-80px" }}
      >
        <Reveal
          active={animate}
          className={cn("mx-auto flex w-full max-w-2xl flex-col items-center text-center", vs.header)}
        >
          {titleElement}
          {descriptionElement}
          {ctasElement}
        </Reveal>

        <Reveal active={animate} variants={mediaItem} className="w-full">
          {mediaElement}
        </Reveal>
      </motion.div>
    </section>
  );
}

export default Hero03;
