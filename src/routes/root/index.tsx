import Confetti from "react-confetti";
import useWindowSize from "../../hooks/useWindowSize";
import styles from "./index.module.css";
import GiftBox from "./GiftBox";
import { useState } from "react";
import Ray from "./Ray";
import { useNavigate } from "react-router-dom";

const Root = () => {
  const navigate = useNavigate();
  const [showConfetti, setShowConfetti] = useState(false);
  const [showRay, setShowRay] = useState(true);
  const [showText, setShowText] = useState(false);
  const { width, height } = useWindowSize();

  const onOpenAnimationEnd = () => {
    setShowConfetti(true);
    setShowText(true);
  };

  const onGiftLoweredAnimationEnd = () => {
    setShowRay(false);
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Ray style={{ opacity: showRay ? 1 : 0, transition: "2s" }} />
      <Confetti width={width} height={height} run={showConfetti} />
      <div
        className={styles.textContainer}
        style={{ opacity: showText ? 1 : 0 }}
      >
        <h3 className={styles.happyBirthdayText}>Happy Birthday!</h3>
        <p
          style={{ zIndex: 100 }}
          onClick={() => {
            navigate("/pokemon");
          }}
        >
          Next
        </p>
      </div>
      <GiftBox
        onOpenAnimationEnd={onOpenAnimationEnd}
        onGiftLoweredAnimationEnd={onGiftLoweredAnimationEnd}
      />
    </div>
  );
};

export default Root;
