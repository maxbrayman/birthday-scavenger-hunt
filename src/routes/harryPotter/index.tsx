import styles from "./index.module.css";
import Backdrop from "../../assets/harry-potter-bg-1.jpeg";
import HarryPotterImg from "../../assets/harry-potter-player.png";
import GoldenSnitchImg from "../../assets/golden-snitch.png";
import DementorImg from "../../assets/dementor.png";
import HarryPotterMusic from "../../assets/harry-potter-theme.mp3";
import { useEffect, useRef, useState } from "react";

class GoldenSnitch {
  x: number;
  y: number;
  dx: number;
  dy: number;
  w = 50;
  h = 30;
  constructor(x: number, y: number, dx = 2, dy = 2) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
  }
}

class Dementor {
  x: number;
  y: number;
  dx: number;
  dy: number;
  w = 60;
  h = 75;
  constructor(x: number, y: number, dx = 2.5, dy = 2.5) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
  }
}

const CANVAS_WIDTH = 370;
const CANVAS_HEIGHT = 650;
const CANVAS_CENTER = {
  x: CANVAS_WIDTH / 2,
  y: CANVAS_HEIGHT / 2,
};

const backdropImg = new Image();
backdropImg.src = Backdrop;

const harryPotterImg = new Image();
harryPotterImg.src = HarryPotterImg;

const goldenSnitchImg = new Image();
goldenSnitchImg.src = GoldenSnitchImg;

const dementorImg = new Image();
dementorImg.src = DementorImg;

const HARRY_POTTER_SIZE = 100;

const INITIAL_HARRY_POTTER = {
  w: HARRY_POTTER_SIZE,
  h: HARRY_POTTER_SIZE,
  x: CANVAS_CENTER.x - HARRY_POTTER_SIZE / 2,
  y: CANVAS_CENTER.y - HARRY_POTTER_SIZE / 2,
  dx: 0,
  dy: 0,
};

const HarryPotter = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const playerPositionRef = useRef({
    x: INITIAL_HARRY_POTTER.x,
    y: INITIAL_HARRY_POTTER.y,
  });
  const snitchRef = useRef<GoldenSnitch | null>(new GoldenSnitch(50, 50));
  const totalSnitchesRef = useRef(0);
  const dementorRef = useRef<Dementor | null>(
    new Dementor(CANVAS_WIDTH - 100, CANVAS_HEIGHT - 100)
  );

  const [isMouseActive, setIsMouseActive] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [totalSnitches, setTotalSnitches] = useState(0);
  const gameEnded = totalSnitches === 10;

  useEffect(() => {
    document.body.addEventListener("touchmove", (e) => e.preventDefault(), {
      passive: false,
    });
    if (gameStarted) {
      updateCanvas();
      audioRef.current?.play();
    }

    return () => {
      if (animationFrameRef.current)
        cancelAnimationFrame(animationFrameRef.current);
    };
  }, [gameStarted]);

  const onMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isMouseActive) return;
    movePlayer(e.clientX, e.clientY);
  };

  const onTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const xPos = e.targetTouches[0].pageX - rect.left;
    const yPos = e.targetTouches[0].pageY - rect.top;
    movePlayer(xPos, yPos);
  };

  const movePlayer = (x: number, y: number) => {
    if (!gameStarted) return;
    const xDiff = Math.abs(playerPositionRef.current.x - x);
    const yDiff = Math.abs(playerPositionRef.current.y - y);

    if (xDiff > HARRY_POTTER_SIZE || yDiff > HARRY_POTTER_SIZE) return;

    playerPositionRef.current = {
      x: x,
      y: y,
    };
  };

  /** COLLISION DETECTION */

  const didHitLeftBoundary = (x: number) => x <= 0;
  const didHitRightBoundary = (x: number, width = 0) =>
    x >= CANVAS_WIDTH - width;
  const didHitTopBoundary = (y: number) => y <= 0;
  const didHitBottomBoundary = (y: number, height = 0) =>
    y >= CANVAS_HEIGHT - height;

  const didHitXBoundary = (x: number, width = 0) =>
    didHitLeftBoundary(x) || didHitRightBoundary(x, width);
  const didHitYBoundary = (y: number, height = 0) =>
    didHitTopBoundary(y) || didHitBottomBoundary(y, height);

  const didPlayerHitSnitch = () => {
    if (!snitchRef.current) return false;
    const collidedHorizontally =
      playerPositionRef.current.x + HARRY_POTTER_SIZE >= snitchRef.current.x &&
      playerPositionRef.current.x <= snitchRef.current.x + snitchRef.current.w;

    const collidedVertically =
      playerPositionRef.current.y + HARRY_POTTER_SIZE >= snitchRef.current.y &&
      playerPositionRef.current.y <= snitchRef.current.y + snitchRef.current.h;

    return collidedHorizontally && collidedVertically;
  };

  const didPlayerHitDementor = () => {
    if (!dementorRef.current) return false;
    const collidedHorizontally =
      playerPositionRef.current.x + HARRY_POTTER_SIZE >=
        dementorRef.current.x &&
      playerPositionRef.current.x <=
        dementorRef.current.x + dementorRef.current.w;

    const collidedVertically =
      playerPositionRef.current.y + HARRY_POTTER_SIZE >=
        dementorRef.current.y &&
      playerPositionRef.current.y <=
        dementorRef.current.y + dementorRef.current.h;

    return collidedHorizontally && collidedVertically;
  };

  const hitDementor = () => {
    if (totalSnitchesRef.current > 0) {
      setTotalSnitches((prev) => prev - 1);
      totalSnitchesRef.current -= 1;
    }
    const prevX = dementorRef.current?.x || 0;
    const prevY = dementorRef.current?.y || 0;
    const prevDx = dementorRef.current?.dx || 1;
    const prevDy = dementorRef.current?.dy || 1;
    const width = dementorRef.current?.w || 0;
    const height = dementorRef.current?.h || 0;
    const newDementorX = Math.min(
      Math.max((prevX + 200) % CANVAS_WIDTH, 5),
      CANVAS_WIDTH - width - 5
    );
    const newDementorY = Math.min(
      Math.max((prevY + 350) % CANVAS_HEIGHT, 5),
      CANVAS_HEIGHT - height - 5
    );

    const newDx = 2 * (prevDx < 0 ? -1 : 1) * -1;
    const newDy = 2 * (prevDy < 0 ? -1 : 1) * -1;

    dementorRef.current = new Dementor(
      newDementorX,
      newDementorY,
      newDx,
      newDy
    );
  };

  const collectSnitch = () => {
    setTotalSnitches((prev) => prev + 1);
    totalSnitchesRef.current += 1;
    if (totalSnitchesRef.current === 10) completeChallenge();
    else {
      const prevX = snitchRef.current?.x || 0;
      const prevY = snitchRef.current?.y || 0;
      const prevDx = snitchRef.current?.dx || 1;
      const prevDy = snitchRef.current?.dy || 1;
      const width = snitchRef.current?.w || 0;
      const height = snitchRef.current?.h || 0;
      let newSnitchX = Math.min(
        Math.max((prevX + 200) % CANVAS_WIDTH, 5),
        CANVAS_WIDTH - width - 5
      );
      let newSnitchY = Math.min(
        Math.max((prevY + 350) % CANVAS_HEIGHT, 5),
        CANVAS_HEIGHT - height - 5
      );

      const newDx = 2 * (prevDx < 0 ? -1 : 1) * -1;
      const newDy = 2 * (prevDy < 0 ? -1 : 1) * -1;

      snitchRef.current = new GoldenSnitch(
        newSnitchX,
        newSnitchY,
        newDx,
        newDy
      );
    }
  };

  const completeChallenge = () => {
    snitchRef.current = null;
    dementorRef.current = null;
    if (animationFrameRef.current)
      cancelAnimationFrame(animationFrameRef.current);
  };

  /** DRAW FUNCTIONS */

  const drawBackdrop = (ctx: CanvasRenderingContext2D) => {
    ctx.drawImage(backdropImg, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  };

  const drawPlayer = (ctx: CanvasRenderingContext2D) => {
    const leftBoundary = 0;
    const rightBoundary = CANVAS_WIDTH - HARRY_POTTER_SIZE;
    const topBoundary = 0;
    const bottomBoundary = CANVAS_HEIGHT - HARRY_POTTER_SIZE;

    let adjustedX = playerPositionRef.current.x;
    let adjustedY = playerPositionRef.current.y;

    if (didHitLeftBoundary(adjustedX)) adjustedX = leftBoundary;
    if (didHitRightBoundary(adjustedX, HARRY_POTTER_SIZE))
      adjustedX = rightBoundary;

    if (didHitTopBoundary(adjustedY)) adjustedY = topBoundary;
    if (didHitBottomBoundary(adjustedY, HARRY_POTTER_SIZE))
      adjustedY = bottomBoundary;

    ctx.drawImage(
      harryPotterImg,
      adjustedX,
      adjustedY,
      HARRY_POTTER_SIZE,
      HARRY_POTTER_SIZE
    );
  };

  const drawSnitch = (ctx: CanvasRenderingContext2D) => {
    if (!snitchRef.current) return;
    ctx.drawImage(
      goldenSnitchImg,
      snitchRef.current.x,
      snitchRef.current.y,
      snitchRef.current.w,
      snitchRef.current.h
    );

    if (didHitXBoundary(snitchRef.current.x, snitchRef.current.w))
      snitchRef.current.dx *= -1;
    if (didHitYBoundary(snitchRef.current.y, snitchRef.current.h))
      snitchRef.current.dy *= -1;

    snitchRef.current.x += snitchRef.current.dx;
    snitchRef.current.y += snitchRef.current.dy;
  };

  const drawDementor = (ctx: CanvasRenderingContext2D) => {
    if (!dementorRef.current) return;

    ctx.drawImage(
      dementorImg,
      dementorRef.current.x,
      dementorRef.current.y,
      dementorRef.current.w,
      dementorRef.current.h
    );

    if (didHitXBoundary(dementorRef.current.x, dementorRef.current.w))
      dementorRef.current.dx *= -1;
    if (didHitYBoundary(dementorRef.current.y, dementorRef.current.h))
      dementorRef.current.dy *= -1;

    dementorRef.current.x += dementorRef.current.dx;
    dementorRef.current.y += dementorRef.current.dy;
  };

  const updateCanvas = () => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    if (didPlayerHitSnitch()) collectSnitch();
    if (didPlayerHitDementor()) hitDementor();

    drawBackdrop(ctx);
    drawSnitch(ctx);
    drawDementor(ctx);
    drawPlayer(ctx);

    animationFrameRef.current = requestAnimationFrame(updateCanvas);
  };

  return (
    <div className={styles.container}>
      {gameStarted ? (
        <>
          <canvas
            ref={canvasRef}
            onClick={(e) => {
              if (!gameStarted) setGameStarted(true);
            }}
            onMouseDown={() => setIsMouseActive(true)}
            onMouseUp={() => setIsMouseActive(false)}
            onMouseMove={onMouseMove}
            onTouchMove={onTouchMove}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            className={styles.canvas}
          >
            Fallback content...
          </canvas>
          <div className={styles.scoreContainer}>
            <div className={styles.scoreLabel}>
              <p>Snitches</p>
              <p>Collected</p>
            </div>
            {gameEnded && (
              <button className={styles.nextButton}>Reveal Clue</button>
            )}
            <p className={styles.scoreCount}>{`${totalSnitches}/10`}</p>
          </div>
        </>
      ) : (
        <div className={styles.preGameContainer}>
          <p className={styles.instructions}>
            To reveal your next clue you need 10 golden snitches. Put your
            finger on Harry and drag him over the snitches to collect them.
            Avoid the Dementors as they will steal your snitches if you get too
            close.
          </p>
          <button
            className={styles.startButton}
            onClick={() => setGameStarted(true)}
          >
            Start
          </button>
        </div>
      )}
      <audio ref={audioRef} src={HarryPotterMusic} playsInline loop></audio>
    </div>
  );
};

export default HarryPotter;
