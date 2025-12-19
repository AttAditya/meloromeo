import { Container, Graphics, Ticker } from "pixi.js";
import { INSTANCES, type EntityInstances } from "@instances";

import { WINDOW_CONFIG } from "@config/window";

let initialized = false;

export function game() {
  const updateCallbacks: ((ticker: Ticker) => void)[] = [];
  const inputUpdates: ((ticker: Ticker) => void)[] = [];

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
    background.scale.set(1.5, 1.5);
    background.position.set(
      -WINDOW_CONFIG.width * 0.25,
      0
    );

    return background;
  }

  async function init() {
    await INSTANCES.inputs.microphone.init();
    inputUpdates.push(INSTANCES.inputs.microphone.update);
  }

  function container() {
    const world = new Container();
    const container = new Container();
    container.label = "world";
    
    if (initialized) return container;
    initialized = true;
    
    const entities = INSTANCES.entities as EntityInstances;
    const controls = INSTANCES.ui.controls;

    Object.values(entities).forEach(entity => {
      container.addChild(entity.container());
      if (entity.update)
        updateCallbacks.push(entity.update);
    });

    const dZoom = 0.05;
    const { width, height } = WINDOW_CONFIG;
    
    let zoom = 1.125;

    container.scale.set(zoom, zoom);
    container.pivot.set(width / 2, height / 2);
    container.position.set(width / 2, height / 2);

    INSTANCES.logics.triggers.static.register(
      "level-up",
      "zoom-out-world",
        () => {
        zoom -= dZoom;
        container.scale.set(zoom, zoom);
      }
    );

    world.addChild(background());
    world.addChild(container);
    world.addChild(controls.container());

    return world;
  }

  function update(ticker: Ticker) {
    updateCallbacks.forEach(callback => callback(ticker));
    inputUpdates.forEach(callback => callback(ticker));
  }

  async function finish() {
    await INSTANCES.inputs.microphone.finish();
  }

  return {
    init,
    container,
    update,
    finish,
  };
}

