import { icons, type LucideProps } from "lucide-react";

type IconProps = LucideProps & {
  name: string;
};

/** Rend une icone lucide-react a partir de son nom (ex: "Crosshair"). */
export function Icon({ name, ...props }: IconProps) {
  const LucideIcon = icons[name as keyof typeof icons];
  if (!LucideIcon) return null;
  return <LucideIcon {...props} />;
}
