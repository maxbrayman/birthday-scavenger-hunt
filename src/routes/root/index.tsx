import Confetti from "react-confetti";
import useWindowSize from "../../hooks/useWindowSize";
import styles from "./index.module.css";
import GiftBox from "./GiftBox";
import { useRef, useState } from "react";
import Ray from "./Ray";
import HappyBirthday from "../../assets/happy-birthday-song.mp3";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";

const Root = () => {
  const navigate = useNavigate();
  const audioRef = useRef<HTMLAudioElement>(null);
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
    audioRef.current?.play();
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
        <Button
          className={styles.button}
          onClick={() => {
            navigate("/7053666");
          }}
        >
          Start
        </Button>
      </div>
      <GiftBox
        onOpenAnimationEnd={onOpenAnimationEnd}
        onGiftLoweredAnimationEnd={onGiftLoweredAnimationEnd}
        containerClassName={styles.giftBoxContainer}
      />
      <audio ref={audioRef} loop playsInline src={HappyBirthday} />
    </div>
  );
};

export default Root;
