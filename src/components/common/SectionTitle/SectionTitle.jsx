import styles from "./SectionTitle.module.css";

export default function SectionTitle({
  children,
  variant = "default",
  rightSlot = null,
  className = "",
}) {
  if (variant === "gold") {
    return (
      <div className={`${styles.goldWrapper} ${className}`}>
        <span
          aria-hidden="true"
          className={styles.goldLine}
        />
        <h2 className={styles.goldTitle}>
          {children}
        </h2>
        {rightSlot}
      </div>
    );
  }

  return (
    <div className={`${styles.wrapper} ${className}`}>
      <h2 className={styles.title}>
        {children}
      </h2>
      {rightSlot}
    </div>
  );
}
