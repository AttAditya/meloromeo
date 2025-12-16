import type { Ticker } from "pixi.js";
import { INSTANCES } from "@instances";

export function angle() {
  const upperLimit: number = 85;
  const lowerLimit: number = 0.1;
  const deltaAngle: number = 0.01;
  
  let currentAngle: number = 45;
  
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
    const volume = INSTANCES.inputs.microphone.static.getVolume();
    const angle = volume * 400;
    
    const sign = (angle >= getAngle()) ? 1 : -1;
    currentAngle += deltaAngle * ticker.deltaMS * sign;
  }

  return {
    update,
    static: {
      getAngle,
    },
  };
}

