export function trajectoryPath() {
  function trajectoryCurry(
    initialVelocity: number,
    angle: number,
    gravity: number = 9.81,
  ) {
    return (x: number): number => {
      const theta = angle * (Math.PI / 180);
      const horizontalVelocity = initialVelocity * Math.cos(theta);

      const linearCoeff = Math.tan(theta);
      const quadraticCoeff = gravity / (
        2 * horizontalVelocity * horizontalVelocity
      );
      
      return (linearCoeff * x) - (quadraticCoeff * x * x);
    };
  }

  return {
    static: {
      trajectoryCurry,
    },
  }
}

