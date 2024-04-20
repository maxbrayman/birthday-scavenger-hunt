import { useEffect, useRef, useState } from "react";
import commonStyles from "../../styles/common.module.css";
import styles from "./index.module.css";
import KungFuPanda from "../../assets/kung-fu-panda.png";
import KungFuPandaMusic from "../../assets/kung-fu-panda-theme.mp3";

const CLUE =
  "You made it to clue 1, you are the best! I hope you enjoy your delicious panda express. But don’t get lazy, because we’ve got more places to go! the next one, you’ll surely know. This spot is a blast from the past. A place where memories were made to last! Don’t worry, we don’t have to go downtown today. There’s a much closer location to sip your favorite shake!";

const Panda = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isOpened, setIsOpened] = useState(false);
  const [cookieAnimationFinished, setCookieAnimationFinished] = useState(false);
  const onAnimationEnd = () => {
    if (!isOpened) return;
    setCookieAnimationFinished(true);
  };

  useEffect(() => {
    if (isOpened) audioRef.current?.play();
  }, [isOpened]);
  return (
    <>
      {cookieAnimationFinished && (
        <div className={`${commonStyles.clue} ${styles.clue}`}>
          <img src={KungFuPanda} alt="" width={130} height={200} />
          <p className={styles.clueText}>{CLUE}</p>
        </div>
      )}
      <button
        onAnimationEnd={onAnimationEnd}
        onClick={() => setIsOpened(true)}
        className={`${styles.fc} ${styles.spawned} ${
          isOpened ? ` ${styles.opened}` : ""
        }`}
        type="button"
      >
        <div className={`${styles.fcPart} ${styles.left}`}></div>
        <div className={`${styles.fcPart} ${styles.right}`}></div>
        <div className={styles.fcCrumbs}>
          <div className={styles.fcCrumb}></div>
          <div className={styles.fcCrumb}></div>
          <div className={styles.fcCrumb}></div>
          <div className={styles.fcCrumb}></div>
          <div className={styles.fcCrumb}></div>
          <div className={styles.fcCrumb}></div>
          <div className={styles.fcCrumb}></div>
          <div className={styles.fcCrumb}></div>
        </div>
      </button>
      <p style={{ opacity: isOpened ? 0 : 1 }} className={styles.instruction}>
        Tap the fortune cookie to reveal your next clue!
      </p>
      <audio loop playsInline src={KungFuPandaMusic} ref={audioRef} />
    </>
  );
};

export default Panda;
