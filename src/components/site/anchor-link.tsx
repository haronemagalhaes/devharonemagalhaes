"use client";

import type { ComponentProps, MouseEvent } from "react";
import { scrollToId } from "@/components/motion/smooth-scroll";

type Props = Omit<ComponentProps<"a">, "href"> & { href: `#${string}` | string };

/** <a href="#id"> com scroll suave e offset do header. */
export function AnchorLink({ href, onClick, children, ...rest }: Props) {
  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented) return;
    if (href.startsWith("#")) {
      e.preventDefault();
      scrollToId(href.slice(1));
    }
  };
  return (
    <a href={href} onClick={handle} {...rest}>
      {children}
    </a>
  );
}
