import { Eyebrow } from "./eyebrow";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

type Props = {
  index?: string;
  eyebrow: string;
  title: string;
  sub?: string;
  className?: string;
  align?: "left" | "center";
  id?: string;
};

export function SectionHeading({
  index,
  eyebrow,
  title,
  sub,
  className,
  align = "left",
  id,
}: Props) {
  return (
    <Reveal
      className={cn(
        "flex flex-col gap-5",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      <Eyebrow index={index}>{eyebrow}</Eyebrow>
      <h2
        id={id}
        className="font-display text-[26px] font-bold leading-[1.15] tracking-[-0.01em] text-ink sm:text-[30px] md:text-[38px] lg:text-[44px]"
      >
        {title}
      </h2>
      {sub && (
        <p className="max-w-[560px] text-[17px] leading-relaxed text-ink-soft md:text-lg">
          {sub}
        </p>
      )}
    </Reveal>
  );
}
