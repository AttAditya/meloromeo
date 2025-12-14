import { Container, Graphics } from "pixi.js";

import { JULIET_CONFIG } from "@config/juliet";
import { COLORS } from "@config/colors";
import { BUILDING_CONFIG } from "@config/building";
import { WINDOW_CONFIG } from "@config/window";
import { GAME_CONFIG } from "@config/game";
import { LAYER_CONFIG } from "@config/layer";

export function juliet() {
  const position = {
    x: 0,
    y: 0,
  };

  function reposition(
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

    position.x = balconyX;
    position.y = balconyY;
  }
  
  function head() {
    const { shape } = JULIET_CONFIG;
    const head = new Graphics().circle(
      0, 0, shape.width / 2
    );
    
    head.pivot.set(-shape.width / 2, -shape.width / 2);
    head.fill({ color: COLORS.JULIET.SKIN });

    return head;
  }

  function body() {
    const { shape } = JULIET_CONFIG;

    const body = new Graphics().rect(
      0,
      shape.width,
      shape.width,
      shape.height
    );
    body.fill({ color: COLORS.JULIET.DRESS });
    
    return body;
  }

  function container() {
    const container = new Container();
    container.label = "juliet";
    
    container.addChild(head());
    container.addChild(body());

    reposition(JULIET_CONFIG.floor);

    const { x: posX, y: posY } = position;
    const { x: offX, y: offY } = JULIET_CONFIG.offset;
    const { width: winW, height: winH } = WINDOW_CONFIG;
    const { groundHeight } = GAME_CONFIG;

    container.zIndex = LAYER_CONFIG.JULIET;
    container.position.set(
      - offX - posX + winW,
      - offY - posY + winH - groundHeight,
    )

    return container;
  }

  return {
    container,
  };
}

