import { ColorMatrixFilter, Container, Sprite, Ticker } from "pixi.js";
import { INSTANCES } from "@instances";

import { BIRD_CONFIG } from "@config/bird";
import { LAYER_CONFIG } from "@config/layer";
import { WINDOW_CONFIG } from "@config/window";

export function bird() {
  const birds: {
    label: string,
    pos: { x: number, y: number },
    dX: number,
    graphic: Sprite,
  }[] = [];

  function globalPostion(x: number, y: number) {
    return {
      x,
      y,
    }
  }

  function bird() {
    const texture = INSTANCES.assets.textures.getTexture("birdFlap1");

    const bird = new Sprite(texture);
    bird.width = 30;
    bird.height = 30;
    bird.anchor.set(0.5);
    bird.position.set(0, 0);

    const cmf = new ColorMatrixFilter();
    cmf.brightness(1.2, false);
    bird.filters = [cmf];

    return bird;
  }

  function container() {
    const container = new Container();
    container.label = "birds";
    
    for (let i = 0; i < BIRD_CONFIG.count; i++) {
      const posX = Math.random() * WINDOW_CONFIG.width;
      const posY = Math.random() * (WINDOW_CONFIG.height / 2);
      const dX = 0.06;

      const graphic = bird();
      const birdLabel = `bird_${i}`;

      container.addChild(graphic);
      INSTANCES.logics.positions.static.updateObjectPosition(
        birdLabel,
        {
          lEdge: posX - 10,
          rEdge: posX + 10,
          tEdge: posY - 10,
          bEdge: posY + 10,
        },
      )

      birds.push({
        label: birdLabel,
        pos: { x: posX, y: posY }, dX,
        graphic,
      });
    }

    container.zIndex = LAYER_CONFIG.BIRD;
    return container;
  }

  function update(ticker: Ticker) {
    birds.forEach(bird => {
      if (bird.pos.x > WINDOW_CONFIG.width + 50 || bird.pos.x < -50)
        bird.dX = -bird.dX;

      bird.pos.x += bird.dX * ticker.deltaMS;
      bird.graphic.position.set(bird.pos.x, bird.pos.y);
      bird.graphic.texture = INSTANCES.assets.textures.getTexture(
        Date.now() % 500 < 250 ? "birdFlap1" : "birdFlap2"
      );

      bird.graphic.scale.x = bird.dX > 0 ? -1 : 1;
      bird.graphic.width = 30;
      bird.graphic.height = 30;

      const { x, y } = globalPostion(bird.pos.x, bird.pos.y);
      INSTANCES.logics.positions.static.updateObjectPosition(
        bird.label,
        {
          lEdge: x - 10,
          rEdge: x + 10,
          tEdge: y - 10,
          bEdge: y + 10,
        },
      )
    });
  }

  return {
    container,
    update,
  };
}

