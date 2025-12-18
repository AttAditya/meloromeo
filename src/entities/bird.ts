import { Container, Sprite, Ticker } from "pixi.js";
import { INSTANCES } from "@instances";

import { BIRD_CONFIG } from "@config/bird";
import { LAYER_CONFIG } from "@config/layer";
import { WINDOW_CONFIG } from "@config/window";

export function bird() {
  const birds: {
    [birdId: string]: {
      label: string,
      pos: { x: number, y: number },
      delta: { x: number, y: number },
      graphic: Sprite,
      }
  } = {};

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

    return bird;
  }

  function fall(birdId: string) {
    const bird = birds[birdId];
    
    bird.delta.x = 0;
    bird.delta.y = 0.15;
    bird.graphic.rotation = Math.PI / 2;
    
    INSTANCES.logics.triggers.static.remove(
      `collide-${bird.label}`,
      `collide-${bird.label}`
    );
  }

  function container() {
    const container = new Container();
    container.label = "birds";
    
    for (let i = 0; i < BIRD_CONFIG.count; i++) {
      const posX = Math.random() * WINDOW_CONFIG.width;
      const posY = Math.random() * (WINDOW_CONFIG.height / 2);

      const graphic = bird();
      const birdLabel = `bird_${i}`;

      container.addChild(graphic);
      INSTANCES.logics.positions.static.updateObjectPosition(
        birdLabel,
        {
          lEdge: posX - 20,
          rEdge: posX + 20,
          tEdge: posY - 20,
          bEdge: posY + 20,
        },
      )

      INSTANCES.logics.triggers.static.register(
        `collide-${birdLabel}`,
        `collide-${birdLabel}`,
        () => fall(birdLabel)
      );

      birds[birdLabel] = {
        label: birdLabel,
        pos: { x: posX, y: posY },
        delta: { x: 0.06, y: 0 },
        graphic,
      };
    }

    container.zIndex = LAYER_CONFIG.BIRD;
    return container;
  }

  function update(ticker: Ticker) {
    const destroyedBirds: string[] = [];
    const {
      logics: { positions: { static: {
        updateObjectPosition,
        removeObject,
      } } }
    } = INSTANCES;

    Object.values(birds).forEach(bird => {
      if (bird.delta.y) bird.delta.y += 0.002 * ticker.deltaMS;
      if (bird.pos.x > WINDOW_CONFIG.width + 50 || bird.pos.x < -50)
        bird.delta.x *= -1;

      bird.pos.x += bird.delta.x * ticker.deltaMS;
      bird.pos.y += bird.delta.y * ticker.deltaMS;

      bird.graphic.position.set(bird.pos.x, bird.pos.y);
      bird.graphic.texture = INSTANCES.assets.textures.getTexture(
        Date.now() % 500 < 250 ? "birdFlap1" : "birdFlap2"
      );

      bird.graphic.scale.x = -(bird.delta.x > 0);
      bird.graphic.width = 30;
      bird.graphic.height = 30;

      const { x, y } = globalPostion(bird.pos.x, bird.pos.y);
      updateObjectPosition(
        bird.label,
        {
          lEdge: x - 20,
          rEdge: x + 20,
          tEdge: y - 20,
          bEdge: y + 20,
        },
      )

      if (bird.pos.y > WINDOW_CONFIG.height + 50)
        destroyedBirds.push(bird.label);
    });

    destroyedBirds.forEach(birdId => {
      birds[birdId].graphic.destroy();
      removeObject(birdId);
      delete birds[birdId];
    });
  }

  return {
    container,
    update,
  };
}

