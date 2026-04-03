import type { ButtonHTMLAttributes, PropsWithChildren } from "react";
import { cn } from "@/shared/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, PropsWithChildren {
  variant?: "primary" | "accent" | "secondary" | "ghost" | "warm";
}

export function Button({ variant = "primary", className, children, ...props }: ButtonProps) {
  return (
    <button
      className={cn("button", variant !== "primary" && variant, className)}
      {...props}
    >
      {children}
    </button>
  );
}
