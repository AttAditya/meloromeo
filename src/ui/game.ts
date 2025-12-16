import { Container, Graphics } from "pixi.js";
import { INSTANCES } from "@instances";

import { button } from "@ui/button";

import { WINDOW_CONFIG } from "@config/window";

export function game() {
  function container() {
    const { throwById } = INSTANCES.logics.throwProjectile.static;

    const container = new Container();
    container.label = "game-ui";

    const stoneIcon = new Graphics();
    stoneIcon.circle(0, 0, 20);
    stoneIcon.fill(0x444444);
    stoneIcon.stroke({ color: 0xffffff, width: 2 });
    stoneIcon.pivot.set(0, 0);

    const flowerIcon = new Graphics();
    flowerIcon.circle(0, 0, 20);
    flowerIcon.fill(0xFDAAAA);
    flowerIcon.stroke({ color: 0xffffff, width: 2 });
    flowerIcon.pivot.set(0, 0);

    const throwStone = button(
      stoneIcon,
      0x999999,
      () => throwById("stone"),
      {
        position: {
          posX: WINDOW_CONFIG.width - 20 - 100,
          posY: WINDOW_CONFIG.height - 20,
        },
        scale: 0.75,
        anchor: {
          anchorX: 1,
          anchorY: 1,
        },
      },
    )

    const throwFlower = button(
      flowerIcon,
      0x59AC77,
      () => throwById("flower"),
      {
        position: {
          posX: WINDOW_CONFIG.width - 20,
          posY: WINDOW_CONFIG.height - 20,
        },
        scale: 0.75,
        anchor: {
          anchorX: 1,
          anchorY: 1,
        },
      },
    )
    
    container.addChild(throwStone);
    container.addChild(throwFlower);

    return container;
  }

  return {
    container,
  };
}

