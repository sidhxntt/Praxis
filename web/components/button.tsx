"use client";
import React from "react";
import { cn } from "@/lib/utils";

export const Button = ({
  href,
  as: Tag = "a",
  children,
  className,
  variant = "primary",
  ...props
}: {
  href?: string;
  as?: React.ElementType;
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "dark" | "gradient";
} & (
  | React.ComponentPropsWithoutRef<"a">
  | React.ComponentPropsWithoutRef<"button">
)) => {
  const baseStyles = cn(
    "px-4 py-2 flex rounded-md text-sm font-bold relative",
    "cursor-pointer hover:-translate-y-0.5 transition duration-200",
    "inline-flex items-center justify-center border-[0.6px] border-solid", // Changed to flex for alignment
    "[border-image-source:linear-gradient(180deg,#1F1F1F_0%,#858585_100%),linear-gradient(180deg,#1F1F1F_0%,#858585_100%)]",
    "[background:linear-gradient(0deg,#151515,#151515),linear-gradient(180deg,rgba(21,21,21,0)_66.3%,rgba(255,255,255,0.5)_100%),linear-gradient(183.22deg,rgba(255,255,255,0.5)_2.62%,rgba(21,21,21,0)_52.03%)]",
    "shadow-[inset_0px_6px_8px_0px_#FAFAFA40,inset_0px_-6px_8px_0px_#FAFAFA40,0px_0px_0px_0px_#FAFAFA40,0px_0px_0px_0px_#FAFAFA40]",
    "text-white"
  );

  const variantStyles = {
    primary: cn(
      "0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),"
    ),
    secondary: "bg-transparent shadow-none text-white",
    dark: cn(
      "bg-black text-white",
      "shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),",
      "0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),",
      "0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
    ),
    gradient: cn(
      "bg-gradient-to-b from-blue-500 to-blue-700 text-white",
      "shadow-[0px_2px_0px_0px_rgba(255,255,255,0.3)_inset]"
    ),
  };

  return (
    <Tag
      href={href || undefined}
      className={cn(baseStyles, variantStyles[variant], className)}
      {...props}
    >
      {children}
    </Tag>
  );
};
