import { Container, Graphics, Ticker } from "pixi.js";
import { INSTANCES } from "@instances";

import { WINDOW_CONFIG } from "@config/window";
import { GAME_CONFIG } from "@config/game";
import { ROMEO_CONFIG } from "@config/romeo";
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
    [projectileId: string]: {
      start: number,
      angle: number,
      power: number,
      time: number,
      timing: (current: number) => number,
    }
  } = {};

  const projectileObjects: { [projectileId: string]: Graphics } = {};
  let projectilesContainer: Container | null = null;
  let projectileIdGen = 0;

  function throwProjectile(rawProjectileId: string) {
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
    
    const projectileGraphic = projectiles[rawProjectileId]();
    let projectileId = "projectile_";
    projectileId += rawProjectileId;
    projectileId += projectileIdGen++;
  
    projectilesContainer?.addChild(projectileGraphic);
    projectileObjects[projectileId] = projectileGraphic;
    thrownData[projectileId] = { start, angle, power, time, timing };
  }

  function projectileUpdate(projectileId: string) {
    const projectileObject = projectileObjects[projectileId];
    const {
      start, angle, power, time, timing
    } = thrownData[projectileId];
    const {
      trajectoryPath: {
        static: { trajectoryCurry },
      },
      positions: {
        static: {
          updateObjectPosition,
          removeObject,
          checkCollision,
        },
      },
      level: {
        static: { triggerLevelUp },
      }
    } = INSTANCES.logics;

    const throwFn = trajectoryCurry(
      power, angle
    )

    const t = (Date.now() - start) / time;
    const interpolatedX = timing(t) * 1 * width;
    const interpolatedY = throwFn(interpolatedX);
    
    projectileObject?.position.set(
      interpolatedX,
      interpolatedY
    );

    const { x, y } = globalPostion(
      interpolatedX,
      interpolatedY,
    );

    updateObjectPosition(
      projectileId,
      {
        lEdge: x - 10,
        rEdge: x + 10,
        tEdge: y - 10,
        bEdge: y + 10,
      }
    );

    const collidedObjectId = checkCollision(projectileId);
    if (
      collidedObjectId === "juliet" &&
      projectileId.includes("flower")
    ) triggerLevelUp();

    const resetFactor = [
      !!collidedObjectId,
      interpolatedY < 0,
      t > 1,
    ];

    if (resetFactor.every(factor => !factor))
      return;

    projectileObject?.position.set(0, 0);
    projectileObject.destroy();
    removeObject(projectileId);

    delete thrownData[projectileId];
    delete projectileObjects[projectileId];
  }

  function flower() {
    const graphics = new Graphics().rect(15, -30, 30, 30);
    graphics.fill({
      texture: INSTANCES.assets.textures.getTexture("flower"),
      textureSpace: "local",
    });
    graphics.scale.set(1, -1);

    return graphics;
  }

  function stone() {
    const graphics = new Graphics().circle(10, 0, 10);
    graphics.fill({
      texture: INSTANCES.assets.textures.getTexture("stone"),
      textureSpace: "local",
    });

    return graphics;
  }

  const projectiles: {
    [key: string]: () => Graphics;
  } = {
    flower,
    stone,
  };

  function globalPostion(x: number, y: number) {
    return {
      x: x + romeoOffsetX + romeoWidth,
      y: -y + height - groundHeight - romeoOffsetY - romeoHeight * 0.75,
    }
  }

  function container() {
    const container = new Container();
    container.label = "projectile";
    projectilesContainer = container;

    container.scale.y = -1;
    container.zIndex = LAYER_CONFIG.PROJECTILE;
    container.position.set(
      romeoOffsetX + romeoWidth,
      height - groundHeight - romeoOffsetY - romeoHeight * 0.75,
    );

    const { registerThrow } = INSTANCES.logics.throwProjectile.static;
    Object.keys(projectiles).forEach(id => {
      registerThrow(id, () => throwProjectile(id));
    });

    return container;
  }

  function update(_: Ticker) {
    Object.keys(thrownData).forEach(projectileId => {
      projectileUpdate(projectileId);
    });
  }

  return {
    container,
    update,
  };
}

