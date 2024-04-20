import { useEffect, useRef, useState } from "react";
import Backdrop from "../../assets/pokemon-backdrop.jpeg";
import MewImage from "../../assets/mew.png";
import Pokeball from "../../assets/pokeball.png";
import PokemonMusic from "../../assets/pokemon-theme.mp3";
import styles from "./index.module.css";
import Button from "../../components/Button";

const CANVAS_WIDTH = 370;
const CANVAS_HEIGHT = 650;
const CANVAS_CENTER = {
  x: CANVAS_WIDTH / 2,
  y: CANVAS_HEIGHT / 2,
};
const GRAVITY = 0.15;
const MEW_WIDTH = 100;
const MEW_HEIGHT = MEW_WIDTH * 1.8;
const CROSS_HAIR_RADIUS = (MEW_WIDTH + 20) / 2;
const CROSS_HAIR_Y = CANVAS_HEIGHT * 0.3 + CROSS_HAIR_RADIUS;
const POKEBALL_SIZE = 80;
const MOVABLE_AREA = {
  top: 50,
  bottom: CROSS_HAIR_Y + MEW_HEIGHT,
  left: 0,
  right: CANVAS_WIDTH - 0,
};

const backdropImg = new Image();
backdropImg.src = Backdrop;

const mewImg = new Image();
mewImg.src = MewImage;
const INITIAL_MEW = {
  w: MEW_WIDTH,
  h: MEW_HEIGHT,
  x: CANVAS_CENTER.x - MEW_WIDTH / 2,
  y: CROSS_HAIR_Y,
  dx: 1,
  dy: 1,
};

const pokeballImg = new Image();
pokeballImg.src = Pokeball;

const INITIAL_POKEBALL = {
  size: POKEBALL_SIZE,
  x: CANVAS_CENTER.x - POKEBALL_SIZE / 2,
  y: CANVAS_HEIGHT - POKEBALL_SIZE - 20,
  dy: 12,
  dSize: 0.475,
  dg: 0.075,
};

const CROSS_HAIR = {
  radius: CROSS_HAIR_RADIUS,
  y: CROSS_HAIR_Y,
  x: CANVAS_CENTER.x,
};

const isClose = (value1: number, value2: number, threshold = 5) => {
  return Math.abs(value2 - value1) < threshold;
};

const drawTextWithSpacing = (
  ctx: CanvasRenderingContext2D,
  {
    text,
    lineWidth,
    x,
    y,
    fillStyle,
    strokeStyle,
    font,
    textAlign,
    style = "stroke",
    spacing = 0,
  }: {
    text: string;
    x: number;
    y: number;
    lineWidth?: CanvasPathDrawingStyles["lineWidth"];
    fillStyle?: CanvasFillStrokeStyles["fillStyle"];
    strokeStyle?: CanvasFillStrokeStyles["strokeStyle"];
    font?: CanvasTextDrawingStyles["font"];
    textAlign?: CanvasTextAlign;
    style?: "stroke" | "fill" | "both";
    spacing?: number;
  }
) => {
  ctx.save();

  if (fillStyle) ctx.fillStyle = fillStyle;
  if (strokeStyle) ctx.strokeStyle = strokeStyle;
  if (lineWidth) ctx.lineWidth = lineWidth;
  if (font) ctx.font = font;
  if (textAlign && !spacing) ctx.textAlign = textAlign;

  if (!spacing) {
    if (style === "both") {
      ctx.fillText(text, x, y);
      ctx.strokeText(text, x, y);
    } else if (style === "fill") {
      ctx.fillText(text, x, y);
    } else {
      ctx.strokeText(text, x, y);
    }
    return;
  }

  const textWidth = ctx.measureText(text).width;
  let currentWidth = 0;

  for (const char of text) {
    const adjustedX = x + currentWidth - textWidth / 2;
    if (style === "both") {
      ctx.fillText(char, adjustedX, y);
      ctx.strokeText(char, adjustedX, y);
    } else if (style === "fill") {
      ctx.fillText(char, adjustedX, y);
    } else {
      ctx.strokeText(char, adjustedX, y);
    }
    currentWidth = currentWidth + ctx.measureText(char).width + spacing;
  }

  ctx.restore();
};

const Pokemon = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isCaught = useRef(false);
  const showText = useRef(false);
  const textOpacity = useRef(0);
  const animationFrameRef = useRef<number | null>(null);
  const isThrowingPokeballRef = useRef(false);
  const pokeballRef = useRef({ ...INITIAL_POKEBALL });
  const mewRef = useRef({ ...INITIAL_MEW });
  const [gameStarted, setGameStarted] = useState(false);
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    if (gameStarted) {
      updateCanvas();
      audioRef.current?.play();
    }

    return () => {
      if (animationFrameRef.current)
        cancelAnimationFrame(animationFrameRef.current);
    };
  }, [gameStarted]);

  useEffect(() => {
    if (complete && animationFrameRef.current)
      cancelAnimationFrame(animationFrameRef.current);
  }, [complete]);

  /** CANVAS STATE CALCULATIONS */

  const getIsMewCatchable = () => {
    const mewCenterX = mewRef.current.x + mewRef.current.w / 2;
    const mewCenterY = mewRef.current.y + mewRef.current.h / 2;

    const crossHairLeft = CROSS_HAIR.x - CROSS_HAIR.radius;
    const crossHairRight = CROSS_HAIR.x + CROSS_HAIR.radius;
    const crossHairTop = CROSS_HAIR.y - CROSS_HAIR.radius;
    const crossHairBottom = CROSS_HAIR.y + CROSS_HAIR.radius;

    return (
      mewCenterX > crossHairLeft &&
      mewCenterX < crossHairRight &&
      mewCenterY > crossHairTop &&
      mewCenterY < crossHairBottom
    );
  };

  const isPokeballFalling = () => pokeballRef.current.dy < 0;

  const isPokeballInCatchRadius = () => {
    const pokeballCenterY = pokeballRef.current.y + pokeballRef.current.size;
    return (
      isPokeballFalling() &&
      isClose(pokeballCenterY, CROSS_HAIR.y, CROSS_HAIR.radius * 0.75)
    );
  };

  const didCatch = () => {
    return isPokeballInCatchRadius() && getIsMewCatchable();
  };

  const resetPokeball = () => {
    isThrowingPokeballRef.current = false;
    pokeballRef.current = { ...INITIAL_POKEBALL };
  };

  /** DRAWING FUNCTIONS */

  const drawPokeball = (ctx: CanvasRenderingContext2D) => {
    if (!pokeballRef.current) return;

    if (isCaught.current) {
      if (!isClose(pokeballRef.current.y, CANVAS_CENTER.y, 10))
        pokeballRef.current.y += 10;
      else {
        showText.current = true;
      }
    } else if (didCatch()) {
      isCaught.current = true;
      isThrowingPokeballRef.current = false;
    } else if (
      isThrowingPokeballRef.current &&
      isPokeballFalling() &&
      isClose(pokeballRef.current.y, CROSS_HAIR.y + CROSS_HAIR.radius + 20)
    ) {
      resetPokeball();
    } else if (isThrowingPokeballRef.current) {
      pokeballRef.current.dy -= GRAVITY - pokeballRef.current.dg;
      pokeballRef.current.dg -= 0.0025;
      pokeballRef.current.y -= pokeballRef.current.dy;
      pokeballRef.current.size -= pokeballRef.current.dSize;
      pokeballRef.current.x = CANVAS_CENTER.x - pokeballRef.current.size / 2;
    }

    ctx.drawImage(
      pokeballImg,
      pokeballRef.current.x,
      pokeballRef.current.y,
      pokeballRef.current.size,
      pokeballRef.current.size
    );
  };

  const drawMew = (ctx: CanvasRenderingContext2D) => {
    if (
      mewRef.current.x + mewRef.current.w === MOVABLE_AREA.right ||
      mewRef.current.x === MOVABLE_AREA.left
    )
      mewRef.current.dx *= -1;
    if (
      mewRef.current.y + mewRef.current.h === MOVABLE_AREA.bottom ||
      mewRef.current.y === MOVABLE_AREA.top
    )
      mewRef.current.dy *= -1;
    mewRef.current.x += mewRef.current.dx;
    mewRef.current.y += mewRef.current.dy;
    ctx.drawImage(
      mewImg,
      mewRef.current.x,
      mewRef.current.y,
      mewRef.current.w,
      mewRef.current.h
    );
  };

  const drawCrossHair = (ctx: CanvasRenderingContext2D) => {
    const isMewCatchable = getIsMewCatchable();

    ctx.save();

    ctx.strokeStyle = isMewCatchable ? "lightgreen" : "grey";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(CROSS_HAIR.x, CROSS_HAIR.y, CROSS_HAIR.radius, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore();
  };

  const drawText = (ctx: CanvasRenderingContext2D) => {
    if (!showText.current) return;
    textOpacity.current = Math.min(1, textOpacity.current + 0.05);
    drawTextWithSpacing(ctx, {
      text: "nice",
      fillStyle: `rgba(255,204,0,${textOpacity.current})`,
      strokeStyle: `rgba(0,117,190,${textOpacity.current})`,
      x: CANVAS_CENTER.x,
      y: CANVAS_CENTER.y - 50,
      lineWidth: 2.5,
      font: "80px pokemon",
      textAlign: "center",
      style: "both",
      spacing: 1,
    });
    if (textOpacity.current === 1) completeChallenge();
  };

  const updateCanvas = () => {
    const ctx = canvasRef.current?.getContext?.("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    // draw backdrop
    ctx.drawImage(backdropImg, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    if (!isCaught.current) {
      drawMew(ctx);
      drawCrossHair(ctx);
    }
    drawPokeball(ctx);
    drawText(ctx);

    animationFrameRef.current = requestAnimationFrame(updateCanvas);
  };

  /** */

  const completeChallenge = () => {
    setComplete(true);
  };

  const onClickButton = () => {
    isThrowingPokeballRef.current = true;
  };

  return (
    <div className={styles.container}>
      {gameStarted ? (
        <>
          <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            className={styles.canvas}
            onClick={() => {
              if (showText.current) {
                console.log("next clue...");
              }
            }}
          >
            Fallback content...
          </canvas>
          <Button
            className={styles.mainButton}
            style={{
              backgroundColor: complete ? "#ff1f1f" : "#5db9ff",
            }}
            disabled={isThrowingPokeballRef.current}
            onClick={onClickButton}
          >
            {complete ? "Reveal Clue" : "Throw"}
          </Button>
        </>
      ) : (
        <div className={styles.preGameContainer}>
          <p className={styles.instructions}>
            To reveal your next clue you'll have to catch the legendary Mew
          </p>
          <p style={{ marginTop: 12, fontSize: 18 }}>
            {
              "(Make sure you have your volumed turned up during the scavenger hunt, we got some bangers coming up)"
            }
          </p>
          <Button
            className={styles.startButton}
            onClick={() => setGameStarted(true)}
          >
            Start
          </Button>
        </div>
      )}
      <audio ref={audioRef} src={PokemonMusic} playsInline loop></audio>
    </div>
  );
};

export default Pokemon;
