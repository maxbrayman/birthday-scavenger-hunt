import Charlie from "../../assets/charlie-with-hat.png";
import Schmidt from "../../assets/schmidt-with-hat.png";
import Paw from "../../assets/paw.png";
import Music from "../../assets/My-Best-Friend.mp3";
import styles from "./index.module.css";
import commonStyles from "../../styles/common.module.css";
import { useEffect, useRef, useState } from "react";

const CLUE =
  "hi dad! it’s charlie and schmidt. you got another clue, wow you did it! now you’re at our favorite place to eat. don’t forget to grab our toys and treats. two more clues in this birthday scavenger hunt. oh boy this is so fun! this place is close, you and mom are obsessed. that’s the only hint we are giving, so use your head! ";

const Dogs = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [showClue, setShowClue] = useState(false);

  useEffect(() => {
    if (showClue) audioRef.current?.play();
  }, [showClue]);
  return (
    <div>
      {showClue ? (
        <div
          className={`${commonStyles.clue} ${styles.clue}`}
          style={{
            width: "90%",
            height: "80%",
            margin: "40px auto 0 auto",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div className={`${styles.topContainer} ${styles.imagesContainer}`}>
            <img
              alt="paw"
              src={Paw}
              width={80}
              height={80}
              className={styles.paw}
            />
            <img
              alt="charlie"
              src={Charlie}
              width={150}
              height={185}
              className={styles.charlie}
            />
          </div>
          <div style={{ overflowY: "scroll", flex: 1, width: "100%" }}>
            <p className={styles.clueText}>{CLUE}</p>
          </div>
          <div
            className={`${styles.bottomContainer} ${styles.imagesContainer}`}
          >
            <img
              alt="schmidt"
              className={styles.schmidt}
              src={Schmidt}
              width={120}
              height={150}
            />
            <img
              alt="paw"
              src={Paw}
              width={80}
              height={80}
              className={styles.paw}
            />
          </div>
        </div>
      ) : (
        <div className={styles.introContainer}>
          <img
            onClick={() => setShowClue(true)}
            alt="paw"
            src={Paw}
            width={200}
            height={200}
            className={`${styles.paw} ${styles.mainPaw}`}
          />
          <p>Tap the paw for a clue from your best friends!</p>
        </div>
      )}
      <audio loop playsInline src={Music} ref={audioRef} />
    </div>
  );
};

export default Dogs;
