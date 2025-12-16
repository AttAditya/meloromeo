import { Container, Graphics } from "pixi.js";
import { INSTANCES } from "@instances";

import { WINDOW_CONFIG } from "@config/window";
import { GAME_CONFIG } from "@config/game";
import { ROMEO_CONFIG } from "@config/romeo";

export function romeo() {
  function romeo() {
    const { height } = WINDOW_CONFIG;
    const { groundHeight } = GAME_CONFIG;
    const { shape, offset } = ROMEO_CONFIG;

    const body = new Graphics().rect(
      offset.x,
      height - shape.height - groundHeight - offset.y,
      shape.width,
      shape.height
    );
    body.fill({
      texture: INSTANCES.assets.textures.getTexture("romeo"),
    });
    
    return body;
  }

  function container() {
    const container = new Container();
    container.label = "romeo";
    container.addChild(romeo());

    return container;
  }

  return {
    container,
  };
}

