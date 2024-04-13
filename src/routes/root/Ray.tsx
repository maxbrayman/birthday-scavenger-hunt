import { CSSProperties } from "react";
import styles from "./ray.module.css";

type RayProps = {
  direction?: "up" | "down";
  className?: string;
  style?: CSSProperties;
};

const STYLES_MAP = {
  up: styles.shineUp,
  down: styles.shineDown,
};

const Ray = ({ direction = "down", className, style }: RayProps) => {
  return (
    <div
      className={`${styles.ray} ${STYLES_MAP[direction]} ${className}`}
      style={style}
    ></div>
  );
};

export default Ray;
