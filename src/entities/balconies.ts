import { Container, Graphics } from "pixi.js";

import { WINDOW_CONFIG } from "@config/window";
import { GAME_CONFIG } from "@config/game";
import { BUILDING_CONFIG } from "@config/building";
import { COLORS } from "@config/colors";
import { LAYER_CONFIG } from "@config/layer";

export function balconies() {
  function balcony(
    level: number = 0,
  ) {
    const {
      balconyGap,
      balcony: {
        shape: { height: balconyHeight },
        offset: {
          x: balconyOffsetX,
          y: balconyOffsetY,
        },
      },
    } = BUILDING_CONFIG;
    
    const levelHeight =
      balconyHeight +
      balconyOffsetY +
      balconyGap;
    
    const balconyX = balconyOffsetX;
    const balconyY =
      balconyOffsetY +
      balconyGap +
      (level * levelHeight);

    const balcony = new Graphics().rect(
      balconyX,
      balconyY,
      BUILDING_CONFIG.balcony.shape.width,
      BUILDING_CONFIG.balcony.shape.height
    );
    
    balcony.zIndex = LAYER_CONFIG.BALCONY;
    balcony.fill({ color: COLORS.BUILDING.BALCONY });
    
    return balcony;
  }

  function container() {
    const container = new Container();
    container.label = "building";

    const {
      shape: { width: buildingWidth },
      offset: { x: buildingOffsetX },
      balcony: {
        shape: { height: balconyHeight },
        offset: { y: balconyOffsetY },
      },
      balconyGap,
      balconyCount,
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

