import type { Ticker } from "pixi.js";
// import { INSTANCES } from "@instances";

export function angle() {
  const upperLimit: number = 89;
  const lowerLimit: number = 0.1;
  // const deltaAngle: number = 0.01;
  const deltaAngle: number = 0.05;
  
  let currentAngle: number = 45;
  let keyUpPressed: boolean = false;
  let keyDnPressed: boolean = false;
  
  function getAngle(): number {
    return Math.max(
      lowerLimit,
      Math.min(
        upperLimit,
        currentAngle
      )
    );
  }

  function update(ticker: Ticker) {
    // const volume = INSTANCES.inputs.microphone.static.getVolume();
    const volume = Number(keyUpPressed) * 90;
    const angle = volume * 400;
    
    if (!keyDnPressed && !keyUpPressed) return;
    const sign = (angle >= getAngle()) ? 1 : -1;
    currentAngle += deltaAngle * ticker.deltaMS * sign;
  }

  window.addEventListener("keydown", (e) => {
    if (e.code === "ArrowUp")
      keyUpPressed = true;
    if (e.code === "ArrowDown")
      keyDnPressed = true;
  });

  window.addEventListener("keyup", (e) => {
    if (e.code === "ArrowUp")
      keyUpPressed = false;
    if (e.code === "ArrowDown")
      keyDnPressed = false;
  });

  return {
    update,
    static: {
      getAngle,
    },
  };
}

