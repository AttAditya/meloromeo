import { Container, Graphics } from "pixi.js";

import { WINDOW_CONFIG } from "@config/window";
import { GAME_CONFIG } from "@config/game";
import { COLORS } from "@config/colors";

export function ground() {
  function grass() {
    const { width, height } = WINDOW_CONFIG;
    const { groundHeight } = GAME_CONFIG;

    const grass = new Graphics().rect(
      0, height - groundHeight, width, 10
    );
    grass.fill({ color: COLORS.GROUND.GRASS });

    return grass;
  }

  function soil() {
    const { width, height } = WINDOW_CONFIG;
    const { groundHeight } = GAME_CONFIG;

    const soil = new Graphics().rect(
      0, height - groundHeight + 10, width, groundHeight - 10
    );
    soil.fill({ color: COLORS.GROUND.DIRT });

    return soil;
  }

  function container() {
    const container = new Container();
    container.label = "ground";

    container.addChild(grass());
    container.addChild(soil());
    
    return container;
  }

  return {
    container,
  }
}

