import { CSSProperties, useRef, useState } from "react";
import styles from "./giftBox.module.css";
import Ray from "./Ray";

const SIDES = [
  "giftBoxSideFront",
  "giftBoxSideBack",
  "giftBoxSideLeft",
  "giftBoxSideRight",
  "giftBoxSideBottom",
];

const LID_SIDES = [
  "giftBoxLidSideFront",
  "giftBoxLidSideBack",
  "giftBoxLidSideLeft",
  "giftBoxLidSideRight",
  "giftBoxLidSideTop",
];

function getTransformations(element?: Element | null) {
  if (!element) return null;
  const computedStyle = window.getComputedStyle(element);
  const transformMatrix =
    computedStyle.getPropertyValue("transform") ||
    computedStyle.getPropertyValue("-webkit-transform");
  // Parse the matrix

  const strippedMatrix = transformMatrix.substring(
    transformMatrix.indexOf("(") + 1,
    transformMatrix.length - 1
  );

  if (strippedMatrix) {
    const matrixValues = strippedMatrix
      .replaceAll(" ", "")
      .split(",")
      .map(parseFloat);
    const translateX = matrixValues[12]; // TranslateX value
    const translateY = matrixValues[13]; // TranslateY value
    const translateZ = matrixValues[14];
    return {
      translateX,
      translateY,
      translateZ,
    };
  } else {
    return {
      translateX: 0,
      translateY: 0,
      translateZ: 0,
    };
  }
}

const RAY_VISIBLE_STYLES: CSSProperties = {
  width: 750,
  height: 550,
  background:
    "linear-gradient(0.25turn,rgba(255, 255, 100, 0.8),rgba(255, 255, 100, 0))",
};

const RAY_INVISIBLE_STYLES: CSSProperties = {
  width: 0,
  height: 0,
};

type GiftBoxProps = {
  onOpenAnimationEnd?: () => void;
  onGiftLoweredAnimationEnd?: () => void;
};

const GiftBox = ({
  onOpenAnimationEnd,
  onGiftLoweredAnimationEnd,
}: GiftBoxProps) => {
  const giftBoxRef = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<CSSProperties>();
  const [lidStyle, setLidStyle] = useState("");
  const [showRay, setShowRay] = useState(false);

  const onClick = () => {
    if (giftBoxRef.current) {
      const computedStyles = window.getComputedStyle(giftBoxRef.current);
      const { transform } = computedStyles;
      if (transform) setStyle({ transform, animation: "none" });
    }

    setTimeout(() => {
      setStyle({
        marginTop: "200px",
        transform:
          "rotateX(0deg) rotateY(0deg) translateZ(-60px) rotateZ(0) translateX(10px) translateY(20px)",
        animation: "none",
      });
    }, 10);
  };

  const onTransitionEnd = () => {
    setLidStyle(styles.giftBoxLidOpen);
    setShowRay(true);
    onGiftLoweredAnimationEnd?.();
  };

  const rayStyle = showRay ? RAY_VISIBLE_STYLES : RAY_INVISIBLE_STYLES;

  return (
    <div className={styles.container} onClick={onClick}>
      <div
        ref={giftBoxRef}
        onTransitionEnd={onTransitionEnd}
        className={`${styles.giftBox} ${styles.rotatingAnimation}`}
        style={style}
      >
        <div
          className={`${styles.giftBoxLid} ${lidStyle}`}
          onAnimationEnd={onOpenAnimationEnd}
        >
          {LID_SIDES.map((className) => (
            <div
              key={className}
              className={`${styles.giftBoxLidSide} ${styles[className]}`}
            ></div>
          ))}
        </div>
        {SIDES.map((className) => (
          <div
            key={className}
            className={`${styles.giftBoxSide} ${styles[className]}`}
          ></div>
        ))}
        <Ray direction="up" style={{ ...rayStyle, transition: "1s" }} />
      </div>
    </div>
  );
};

export default GiftBox;
