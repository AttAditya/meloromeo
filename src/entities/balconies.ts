import { Container, Graphics } from "pixi.js";
import { INSTANCES } from "@instances";

import { WINDOW_CONFIG } from "@config/window";
import { GAME_CONFIG } from "@config/game";
import { LAYER_CONFIG } from "@config/layer";
import { BALCONY_CONFIG } from "@config/balcony";
import { BUILDING_CONFIG } from "@config/building";

export function balconies() {
  function balcony(
    level: number = 0,
  ) {
    const {
      balconyGap,
      shape: {
        height,
        width,
      },
      offset: {
        x: offsetX,
        y: offsetY,
      },
    } = BALCONY_CONFIG;
    
    const levelHeight =
      height +
      offsetY +
      balconyGap;
    
    const balconyX = offsetX;
    const balconyY =
      offsetY +
      balconyGap +
      (level * levelHeight);

    const balcony = new Graphics().rect(
      balconyX,
      balconyY,
      width,
      height
    );
    
    balcony.zIndex = LAYER_CONFIG.BALCONY;
    balcony.fill({
      texture: INSTANCES.assets.textures.get("balcony"),
      textureSpace: "local",
    });
    
    return balcony;
  }

  function container() {
    const container = new Container();
    container.label = "building";

    const {
      shape: { height: balconyHeight },
      offset: { y: balconyOffsetY },
      balconyGap,
      balconyCount,
    } = BALCONY_CONFIG;

    const {
      shape: { width: buildingWidth },
      offset: { x: buildingOffsetX },
    } = BUILDING_CONFIG;

    const levelHeight = balconyHeight + balconyOffsetY + balconyGap;
    const buildingHeight = levelHeight * balconyCount;
    
    const balconies = [...Array(balconyCount)].map((_, level) => {
      return balcony(level);
    });
    
    balconies.forEach(balcony => container.addChild(balcony));

    container.pivot.set(
      buildingWidth + buildingOffsetX,
      buildingHeight,
    );

    container.zIndex = LAYER_CONFIG.BALCONY;
    container.position.set(
      WINDOW_CONFIG.width,
      WINDOW_CONFIG.height - GAME_CONFIG.groundHeight,
    )

    return container;
  }

  return {
    container,
  }
}

