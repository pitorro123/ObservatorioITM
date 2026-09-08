import * as LucideIcons from "lucide-react";
import styles from "./Icon.module.css";

export default function Icon({
  name,
  className = "",
  ...props
}) {
  const LucideIcon = LucideIcons[name];

  if (!LucideIcon) {
    return null;
  }

  return (
    <LucideIcon
      className={`${styles.icon} ${className}`}
      aria-hidden="true"
      {...props}
    />
  );
}
