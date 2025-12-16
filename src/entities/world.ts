import { Container, Graphics, Ticker } from "pixi.js";
import { INSTANCES, type EntityInstances } from "@instances";

import { WINDOW_CONFIG } from "@config/window";

let initialized = false;

export function world() {
  const updateCallbacks: ((ticker: Ticker) => void)[] = [];

  function background() {
    const background = new Graphics();
    background.rect(
      0, 0,
      WINDOW_CONFIG.width,
      WINDOW_CONFIG.height
    );

    background.fill({
      texture: INSTANCES.assets.textures.getTexture("background"),
      textureSpace: "local",
    });
    background.alpha = 0.6;

    return background;
  }

  function container() {
    const container = new Container();
    container.label = "world";
    
    if (initialized) return container;
    initialized = true;

    const entities = INSTANCES.entities as EntityInstances;
    container.addChild(background());

    Object.values(entities).forEach(entity => {
      const entityContainer = entity.container();
      if (entityContainer.label === "world") {
        entityContainer.destroy();
        return;
      }

      container.addChild(entityContainer);
      if (entity.update)
        updateCallbacks.push(entity.update);
    });

    const dZoom = 0.05;
    const { width, height } = WINDOW_CONFIG;
    
    let zoom = 1.125;

    container.scale.set(zoom, zoom);
    container.pivot.set(width / 2, height / 2);
    container.position.set(width / 2, height / 2);

    INSTANCES.logics.level.static.onLevelUp(() => {
      zoom -= dZoom;
      container.scale.set(zoom, zoom);
    });

    return container;
  }

  function update(ticker: Ticker) {
    updateCallbacks.forEach(callback => callback(ticker));
  }

  return {
    container,
    update,
  };
}

