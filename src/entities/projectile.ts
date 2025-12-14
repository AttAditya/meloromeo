import { Container, Graphics, Ticker } from "pixi.js";
import { INSTANCES } from "@instances";

import { WINDOW_CONFIG } from "@config/window";
import { GAME_CONFIG } from "@config/game";
import { ROMEO_CONFIG } from "@config/romeo";
import { COLORS } from "@config/colors";
import { LAYER_CONFIG } from "@config/layer";

export function projectile() {
  const { width, height } = WINDOW_CONFIG;
  const { groundHeight } = GAME_CONFIG;
  const {
    shape: {
      width: romeoWidth,
      height: romeoHeight,
    },
    offset: {
      x: romeoOffsetX,
      y: romeoOffsetY,
    }
  } = ROMEO_CONFIG;

  let thrownData: {
    start: number,
    angle: number,
    power: number,
    time: number,
    timing: (current: number) => number,
  } | null = null;

  let projectileObject: Graphics | null = null;

  function throwProjectile() {
    const { getAngle } = INSTANCES.logics.angle.static;
    const { trajectoryCurry } = INSTANCES.logics.trajectoryPath.static;

    const start = Date.now();
    const angle = getAngle();
    const power = 120;

    const throwFn = trajectoryCurry(
      power, angle
    )

    let length = 0;
    let previousPoint = [0, 0];
    let highest = [0, 0];

    for (let t = 0; t <= 1; t += 0.01) {
      const interpolatedX = t * 0.7 * width;
      const interpolatedY = throwFn(interpolatedX);

      const dx = interpolatedX - previousPoint[0];
      const dy = interpolatedY - previousPoint[1];

      if (interpolatedY > highest[1]) {
        highest = [t, interpolatedY];
      }
      
      length += Math.sqrt(dx * dx + dy * dy);
      previousPoint = [interpolatedX, interpolatedY];
      
      if (dy < 0) break;
    }

    const timing = (current: number) => {
      return (current < highest[0])
        ? Math.pow(current, 0.9)
        : Math.pow(current, 1.1);
    };

    const time = (length / power) * 200;
    thrownData = { start, angle, power, time, timing };
  }

  function flower() {
    const graphics = new Graphics().rect(5, -5, 15, 15);
    graphics.fill({ color: 0xff00ff });

    return graphics;
  }

  function stone() {
    const graphics = new Graphics().circle(10, 0, 7.5);
    graphics.fill({ color: COLORS.PROJECTILES.STONE });

    return graphics;
  }

  const projectiles = {
    flower,
    stone,
  };

  function container() {
    const container = new Container();
    container.label = "projectile";

    projectileObject = projectiles.stone();
    container.addChild(projectileObject);

    container.scale.y = -1;
    container.zIndex = LAYER_CONFIG.PROJECTILE;
    container.position.set(
      romeoOffsetX + romeoWidth,
      height - groundHeight - romeoOffsetY - romeoHeight * 0.75,
    );

    window.addEventListener("keyup", (e) => {
      if (e.code !== "Space") return;
      if (!thrownData)
        throwProjectile();
    });

    return container;
  }

  function update(_: Ticker) {
    if (!thrownData) return;

    const { start, angle, power, time, timing } = thrownData;
    const { trajectoryCurry } = INSTANCES.logics.trajectoryPath.static;

    const throwFn = trajectoryCurry(
      power, angle
    )

    const t = (Date.now() - start) / time;
    const interpolatedX = timing(t) * 0.7 * width;
    const interpolatedY = throwFn(interpolatedX);
    
    projectileObject?.position.set(
      interpolatedX,
      interpolatedY
    );

    if (interpolatedY < 0) {
      thrownData = null;
      projectileObject?.position.set(0, 0);
      return;
    }

    if (t > 1) {
      thrownData = null;
      projectileObject?.position.set(0, 0);
    }

    return;
  }

  return {
    container,
    update,
  };
}

