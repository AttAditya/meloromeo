import { Container, Graphics } from "pixi.js";

import { WINDOW_CONFIG } from "@config/window";
import { GAME_CONFIG } from "@config/game";
import { BUILDING_CONFIG } from "@config/building";
import { COLORS } from "@config/colors";

export function building() {
  function wall(buildingHeight: number) {
    const {
      shape: { width: buildingWidth },
    } = BUILDING_CONFIG;

    const building = new Graphics().rect(
      0, 0,
      buildingWidth,
      buildingHeight
    );
    building.fill({ color: COLORS.BUILDING.STONE });
    
    return building;
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
    
    container.addChild(wall(buildingHeight));
    container.pivot.set(
      buildingWidth + buildingOffsetX,
      buildingHeight,
    );

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

