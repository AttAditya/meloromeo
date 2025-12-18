import { Container, Graphics } from "pixi.js";
import { INSTANCES } from "@instances";

import { button } from "@ui/button";

import { WINDOW_CONFIG } from "@config/window";

export function controls() {
  function container() {
    const { throwById } = INSTANCES.logics.throwProjectile.static;

    const container = new Container();
    container.label = "game-ui";

    const stoneIcon = new Graphics();
    stoneIcon.circle(0, 0, 30);
    stoneIcon.pivot.set(0, 0);
    stoneIcon.fill({
      texture: INSTANCES.assets.textures.get("stone"),
      textureSpace: "local",
    });

    const flowerIcon = new Graphics();
    flowerIcon.circle(0, 0, 30);
    flowerIcon.pivot.set(0, 0);
    flowerIcon.fill({
      texture: INSTANCES.assets.textures.get("flower"),
      textureSpace: "local",
    });

    const throwStone = button(
      stoneIcon,
      0xDDDDDD,
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
      0xDDDDDD,
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

