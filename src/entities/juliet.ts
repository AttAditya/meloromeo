import { Container, Graphics } from "pixi.js";
import { INSTANCES } from "@instances";

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

  function globalPostion(x: number, y: number) {
    const { x: offX, y: offY } = JULIET_CONFIG.offset;
    const { width: winW, height: winH } = WINDOW_CONFIG;
    const { groundHeight } = GAME_CONFIG;

    return {
      x: - offX - x + winW,
      y: - offY - y + winH - groundHeight,
    }
  }

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

    const { x, y } = globalPostion(position.x, position.y);
    INSTANCES.logics.positions.static.updateObjectPosition(
      "juliet",
      {
        lEdge: x - (JULIET_CONFIG.shape.width / 2),
        rEdge: x + (JULIET_CONFIG.shape.width / 2),
        tEdge: y,
        bEdge: y + JULIET_CONFIG.shape.height,
      }
    )
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

    INSTANCES.logics.level.static.onLevelUp(() => {
      JULIET_CONFIG.floor += 1;
      reposition(JULIET_CONFIG.floor);
      container.position.set(
        - offX - position.x + winW,
        - offY - position.y + winH - groundHeight,
      );
    });

    return container;
  }

  return {
    container,
  };
}

