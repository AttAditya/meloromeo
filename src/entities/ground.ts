import { Container, Graphics } from "pixi.js";

import { WINDOW_CONFIG } from "@config/window";
import { GAME_CONFIG } from "@config/game";
import { COLORS } from "@config/colors";

export function ground() {
  function grass() {
    const { width, height } = WINDOW_CONFIG;
    const { groundHeight } = GAME_CONFIG;

    const grassX = -width;
    const grassY = height - groundHeight;
    const grassW = width * 3;
    const grassH = 10;

    const grass = new Graphics().rect(
      grassX, grassY, grassW, grassH
    );
    grass.fill({ color: COLORS.GROUND.GRASS });
    grass.stroke({
      color: 0x000000,
      width: 2,
    });

    return grass;
  }

  function soil() {
    const { width, height } = WINDOW_CONFIG;
    const { groundHeight } = GAME_CONFIG;

    const soilX = -width;
    const soilY = height - groundHeight + 10;
    const soilW = width * 3;
    const soilH = groundHeight * 3;

    const soil = new Graphics().rect(
      soilX, soilY, soilW, soilH
    );
    soil.fill({ color: COLORS.GROUND.DIRT });

    return soil;
  }

  function container() {
    const container = new Container();
    container.label = "ground";

    container.addChild(soil());
    container.addChild(grass());
    
    return container;
  }

  return {
    container,
  }
}

