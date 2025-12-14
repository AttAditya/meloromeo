import { BIRD_CONFIG } from "@config/bird";
import { LAYER_CONFIG } from "@config/layer";
import { WINDOW_CONFIG } from "@config/window";
import { Container, Graphics, Ticker } from "pixi.js";

export function bird() {
  const birds: {
    pos: { x: number, y: number },
    dX: number,
    graphic: Graphics,
  }[] = [];

  function bird() {
    const shape = {
      width: 20,
      height: 20,
    };

    const head = new Graphics().circle(0, 0, shape.width / 2);
    head.fill({ color: 0xffff00 });

    return head;
  }

  function container() {
    const container = new Container();
    container.label = "birds";
    
    for (let i = 0; i < BIRD_CONFIG.count; i++) {
      const posX = Math.random() * WINDOW_CONFIG.width;
      const posY = Math.random() * (WINDOW_CONFIG.height / 2);
      const dX = 0.06;

      const graphic = bird();
      container.addChild(graphic);

      birds.push({
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
    });
  }

  return {
    container,
    update,
  };
}

