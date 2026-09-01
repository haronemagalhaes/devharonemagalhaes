import Image from "next/image";
import Monograma from "@/assets/monograma.png";
import { SITE_DESCRIPTOR, SITE_NAME } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * Lockup da marca: monograma + "Harone Magalhães" + fio vertical + descritor.
 * `compact` esconde o descritor (mobile / header encolhido).
 */
export function Lockup({
  compact = false,
  className,
  descriptorClassName,
}: {
  compact?: boolean;
  className?: string;
  descriptorClassName?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <Image
        src={Monograma}
        alt=""
        aria-hidden
        width={34}
        height={22}
        className="h-[18px] w-auto shrink-0 md:h-[20px]"
        priority
      />
      <span className="whitespace-nowrap font-display text-[15px] font-bold leading-none tracking-[-0.02em] text-ink md:text-base">
        {SITE_NAME}
      </span>
      {!compact && (
        <>
          <span aria-hidden className="h-4 w-px bg-line" />
          <span className={cn("eyebrow whitespace-nowrap !text-[11px]", descriptorClassName)}>
            {SITE_DESCRIPTOR}
          </span>
        </>
      )}
    </span>
  );
}
