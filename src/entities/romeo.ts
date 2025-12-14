import { Container, Graphics } from "pixi.js";

import { WINDOW_CONFIG } from "@config/window";
import { GAME_CONFIG } from "@config/game";
import { ROMEO_CONFIG } from "@config/romeo";
import { COLORS } from "@config/colors";

export function romeo() {
  function head() {
    const { height } = WINDOW_CONFIG;
    const { groundHeight } = GAME_CONFIG;
    const { shape, offset } = ROMEO_CONFIG;

    const head = new Graphics().circle(
      offset.x + shape.width / 2,
      (
        height -
        shape.height -
        groundHeight -
        offset.y -
        (shape.width / 2)
      ),
      shape.width / 2
    );
    head.fill({ color: COLORS.ROMEO.SKIN });

    return head;
  }

  function body() {
    const { height } = WINDOW_CONFIG;
    const { groundHeight } = GAME_CONFIG;
    const { shape, offset } = ROMEO_CONFIG;

    const body = new Graphics().rect(
      offset.x,
      height - shape.height - groundHeight - offset.y,
      shape.width,
      shape.height
    );
    body.fill({ color: COLORS.ROMEO.TSHIRT });
    
    return body;
  }

  function container() {
    const container = new Container();
    container.label = "romeo";
    
    container.addChild(head());
    container.addChild(body());

    return container;
  }

  return {
    container,
  };
}

