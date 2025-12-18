import { Container, Graphics } from "pixi.js";
import { INSTANCES } from "@instances";

import { JULIET_CONFIG } from "@config/juliet";
import { WINDOW_CONFIG } from "@config/window";
import { GAME_CONFIG } from "@config/game";
import { LAYER_CONFIG } from "@config/layer";
import { BALCONY_CONFIG } from "@config/balcony";

export function juliet() {
  const position = { x: 0, y: 0 };
  let julietContainer: Container | null = null;

  function globalPostion(x: number, y: number) {
    const { x: offX, y: offY } = JULIET_CONFIG.offset;
    const { width: winW, height: winH } = WINDOW_CONFIG;
    const { groundHeight } = GAME_CONFIG;

    return {
      x: offX - x + winW,
      y: offY - y + winH - groundHeight,
    }
  }

  function reposition(
    level: number = 0,
  ) {
    const {
      balconyGap,
      shape: { height: balconyHeight },
      offset: {
        x: balconyOffsetX,
        y: balconyOffsetY,
      },
    } = BALCONY_CONFIG;
    
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

  function juliet() {
    const { shape } = JULIET_CONFIG;
    const body = new Graphics().rect(
      0, 0,
      shape.width,
      shape.height
    );

    body.fill({
      texture: INSTANCES.assets.textures.get("juliet"),
      textureSpace: "local",
    });
    
    return body;
  }

  function checkCollision() {
    const {
      positions: { static: { checkCollision } },
      triggers: { static: { trigger } },
    } = INSTANCES.logics;
    
    const collisionId = checkCollision("juliet");
    
    if (collisionId?.includes("flower")) {
      trigger("level-up");
      return;
    }
  }

  function levelUp() {
    const { x: offX, y: offY } = JULIET_CONFIG.offset;
    const { width: winW, height: winH } = WINDOW_CONFIG;
    const { groundHeight } = GAME_CONFIG;

    JULIET_CONFIG.floor += 1;
    reposition(JULIET_CONFIG.floor);
    julietContainer?.position.set(
      offX - position.x + winW,
      offY - position.y + winH - groundHeight,
    );
  }

  function container() {
    const container = new Container();
    container.label = "juliet";
    julietContainer = container;
    
    container.addChild(juliet());
    reposition(JULIET_CONFIG.floor);

    const { x: posX, y: posY } = position;
    const { x: offX, y: offY } = JULIET_CONFIG.offset;
    const { width: winW, height: winH } = WINDOW_CONFIG;
    const { groundHeight } = GAME_CONFIG;

    container.zIndex = LAYER_CONFIG.JULIET;
    container.position.set(
      offX - posX + winW,
      offY - posY + winH - groundHeight,
    )

    const { register } = INSTANCES.logics.triggers.static;
    register("collide-juliet", "collide-juliet", checkCollision);
    register("level-up", "reposition-juliet", levelUp);

    return container;
  }

  return {
    container,
  };
}

