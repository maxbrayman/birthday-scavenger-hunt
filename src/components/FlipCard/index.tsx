import { ReactElement } from "react";
import styles from "./index.module.css";

type FlipCardProps = {
  Front: ReactElement;
  Back: ReactElement;
  containerClassName?: string;
  isFlipped?: boolean;
};

const FlipCard = ({
  Front,
  Back,
  containerClassName,
  isFlipped,
}: FlipCardProps) => {
  return (
    <div
      className={`${styles.card}${
        containerClassName ? ` ${containerClassName}` : ""
      }`}
    >
      <div
        className={`${styles.cardContent}${
          isFlipped ? ` ${styles.isFlipped}` : ""
        }`}
      >
        <div className={styles.cardFront}>{Front}</div>
        <div className={styles.cardBack}>{Back}</div>
      </div>
    </div>
  );
};

export default FlipCard;
