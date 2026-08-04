import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "whatsapp" | "light";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary:
    "bg-brand-red text-white shadow-glow hover:bg-brand-red-dark focus-visible:ring-brand-red",
  secondary:
    "bg-navy-900 text-white hover:bg-navy-800 focus-visible:ring-navy-700",
  outline:
    "border border-navy-200 bg-white text-navy-800 hover:border-navy-300 hover:bg-navy-50 focus-visible:ring-navy-300",
  ghost: "text-navy-700 hover:bg-navy-50 focus-visible:ring-navy-200",
  whatsapp: "bg-[#25D366] text-white hover:bg-[#1eb257] focus-visible:ring-[#25D366]",
  light:
    "bg-white text-navy-900 hover:bg-navy-50 focus-visible:ring-white/60",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-sm",
  lg: "h-13 px-8 text-base py-3.5",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
};

type ButtonAsButton = CommonProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type ButtonAsLink = CommonProps & {
  href: string;
  external?: boolean;
};

export function Button(props: ButtonAsButton | ButtonAsLink) {
  const { variant = "primary", size = "md", className, children } = props;
  const classes = cn("btn", variants[variant], sizes[size], className);

  if ("href" in props && props.href !== undefined) {
    const { href, external } = props;
    if (external) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  const { variant: _v, size: _s, className: _c, children: _ch, ...rest } =
    props as ButtonAsButton;
  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
