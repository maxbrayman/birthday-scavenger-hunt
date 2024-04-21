import CaptainAmerica from "../../assets/captain-america.png";
import SpiderMan from "../../assets/spider-man.png";
import Groot from "../../assets/groot.png";
import Hulk from "../../assets/hulk.png";
import IronMan from "../../assets/iron-man.png";
import InfinityStones from "../../assets/infinity-stones.png";
import styles from "./index.module.css";
import { useEffect, useRef, useState } from "react";
import SpiderManMusic from "../../assets/spider-man-theme.mp3";

const CLUE =
  "YES! the melt, you birthday genius you. you’ve made it all the way to clue 3! go ahead and slurp up your yummy oreos, and i’ll give you a hint of the next place to go. this place has food, but not for you. think of your boys and you’ll know just what to do. ";

const Avengers = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [showClue, setShowClue] = useState(false);

  useEffect(() => {
    if (showClue) audioRef.current?.play();
  }, [showClue]);
  return (
    <div>
      <img
        alt="captain-america"
        src={CaptainAmerica}
        width={150}
        height={225}
        style={{
          position: "absolute",
          bottom: 0,
          right: 0,
        }}
      />
      <img
        alt="hulk"
        src={Hulk}
        width={150}
        height={225}
        style={{
          position: "absolute",
          right: 0,
        }}
      />
      <p style={{ position: "absolute", left: 20, top: 70 }}>
        Grab the Infinity Stones!
      </p>
      <img
        alt="groot"
        src={Groot}
        width={100}
        height={150}
        style={{
          position: "absolute",
          left: 20,
          top: 100,
        }}
      />

      <img
        alt="iron-man"
        src={IronMan}
        width={120}
        height={180}
        style={{
          position: "absolute",
          left: 0,
          bottom: 100,
        }}
      />
      <img
        alt="infinity-stones"
        src={InfinityStones}
        width={150}
        height={150}
        className={styles.infinityStones}
        onClick={() => setShowClue(true)}
      />
      {showClue && (
        <div className={styles.clue}>
          <img alt="spider-man" src={SpiderMan} width={225} height={175} />
          <p className={styles.clueText}>{CLUE.toUpperCase()}</p>
        </div>
      )}
      <audio src={SpiderManMusic} loop playsInline ref={audioRef} />
    </div>
  );
};

export default Avengers;
