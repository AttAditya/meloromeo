import type { Ticker } from "pixi.js";

export function angle() {
  const upperLimit: number = 89;
  const lowerLimit: number = 0.1;
  
  let currentAngle: number = 0.2;
  let deltaAngle: number = 0.05;

  const keypressed = {
    up: false,
    down: false,
  };

  function getAngle(): number {
    return Math.pow(currentAngle / upperLimit, 1/2) * upperLimit;
  }

  function update(ticker: Ticker) {
    if (keypressed.up) {
      currentAngle += deltaAngle * ticker.deltaMS;
      if (currentAngle > upperLimit) {
        currentAngle = upperLimit;
      }
    }

    if (keypressed.down) {
      currentAngle -= deltaAngle * ticker.deltaMS;
      if (currentAngle < lowerLimit) {
        currentAngle = lowerLimit;
      }
    }
  }

  window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp") {
      keypressed.up = true;
    }
    if (e.key === "ArrowDown") {
      keypressed.down = true;
    }
  });

  window.addEventListener("keyup", (e) => {
    if (e.key === "ArrowUp") {
      keypressed.up = false;
    }
    if (e.key === "ArrowDown") {
      keypressed.down = false;
    }
  });
  
  return {
    update: update,
    static: {
      getAngle,
    },
  };
}

