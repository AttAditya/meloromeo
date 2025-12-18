import { Container, Graphics, Ticker } from "pixi.js";
import { INSTANCES, type EntityInstances } from "@instances";

import { WINDOW_CONFIG } from "@config/window";

export function menu() {
  const updateCallbacks: ((ticker: Ticker) => void)[] = [];

  function background() {
    const background = new Graphics();
    background.rect(
      0, 0,
      WINDOW_CONFIG.width,
      WINDOW_CONFIG.height
    );

    background.fill({
      texture: INSTANCES.assets.textures.get("background"),
      textureSpace: "local",
    });

    background.alpha = 0.6;
    background.scale.set(2.5, 2.5);
    background.position.set(
      - WINDOW_CONFIG.width * 0.66, 0
    );

    return background;
  }

  function container() {
    const world = new Container();
    const container = new Container();
    container.label = "world";
    
    const entities = INSTANCES.entities as EntityInstances;

    Object.values(entities).forEach(entity => {
      container.addChild(entity.container());
      if (entity.update)
        updateCallbacks.push(entity.update);
    });

    world.addChild(background());

    return world;
  }

  function update(ticker: Ticker) {
    updateCallbacks.forEach(callback => callback(ticker));
  }

  return {
    container,
    update,
  };
}

