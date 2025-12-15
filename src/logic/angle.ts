import { INSTANCES } from "@instances";

export function angle() {
  const upperLimit: number = 89;
  const lowerLimit: number = 0.1;
  
  function getAngle(): number {
    const note = INSTANCES.inputs.microphone.static.getNote();
    const angle = Math.log10(note?.freq || 0) / 3.5 * upperLimit;

    return Math.max(
      lowerLimit,
      Math.min(
        upperLimit,
        angle
      )
    );
  }

  return {
    static: {
      getAngle,
    },
  };
}

