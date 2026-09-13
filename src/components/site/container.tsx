import { cn } from "@/lib/utils";

export function Container({
  className,
  children,
  as: Tag = "div",
}: {
  className?: string;
  children: React.ReactNode;
  as?: "div" | "section" | "footer" | "header" | "nav";
}) {
  return <Tag className={cn("container-studio", className)}>{children}</Tag>;
}
