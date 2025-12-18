import { Container, Graphics } from "pixi.js";

import { WINDOW_CONFIG } from "@config/window";
import { GAME_CONFIG } from "@config/game";
import { BUILDING_CONFIG } from "@config/building";
import { BALCONY_CONFIG } from "@config/balcony";
import { INSTANCES } from "@instances";

export function building() {
  function floor(y: number) {
    const {
      shape: { height: balconyHeight },
      offset: { y: balconyOffsetY },
      balconyGap,
    } = BALCONY_CONFIG;

    const levelHeight = balconyHeight + balconyOffsetY + balconyGap;

    const floor = new Graphics().rect(
      0, y * levelHeight,
      BUILDING_CONFIG.shape.width,
      levelHeight,
    );

    floor.fill({
      texture: INSTANCES.assets.textures.get("floor"),
      textureSpace: "local",
    });

    return floor;
  }

  function wall() {
    const {
      shape: { height: balconyHeight },
      offset: { y: balconyOffsetY },
      balconyGap,
      balconyCount,
    } = BALCONY_CONFIG;

    const levelHeight = balconyHeight + balconyOffsetY + balconyGap;
    const buildingHeight = levelHeight * balconyCount + 4;
    
    const wall = new Graphics();
    wall.rect(
      0, 0,
      BUILDING_CONFIG.shape.width,
      buildingHeight,
    ).stroke({
      color: 0x000000,
      width: 4,
    })

    return wall;
  }

  function container() {
    const container = new Container();
    container.label = "building";

    const {
      shape: { width: buildingWidth },
      offset: { x: buildingOffsetX },
    } = BUILDING_CONFIG;
    
    const {
      shape: { height: balconyHeight },
      offset: { y: balconyOffsetY },
      balconyGap,
      balconyCount,
    } = BALCONY_CONFIG;

    const levelHeight = balconyHeight + balconyOffsetY + balconyGap;
    const buildingHeight = levelHeight * balconyCount;

    for (let level = 0; level < balconyCount; level++)
      container.addChild(floor(level));
    container.addChild(wall());

    container.pivot.set(
      buildingWidth + buildingOffsetX * 2.25,
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

