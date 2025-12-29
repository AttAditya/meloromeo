import { Container, Graphics, Ticker } from "pixi.js";
import { INSTANCES } from "@instances";

import { text } from "@ui/text";

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

  async function init() {}

  function container() {
    const world = new Container();
    const container = new Container();
    const hub = INSTANCES.ui.hub;
    
    container.label = "world";

    const title = text("MELOROMEO", {
      x: WINDOW_CONFIG.width / 2,
      y: 100,
    });

    const subtitle = text(
      "Sing The Melody Of Love",
      {
        x: WINDOW_CONFIG.width / 2,
        y: 140,
      },
      20, 4,
    );

    world.addChild(background());
    world.addChild(hub.container());
    world.addChild(title);
    world.addChild(subtitle);

    return world;
  }

  function update(ticker: Ticker) {
    updateCallbacks.forEach(callback => callback(ticker));
  }

  async function finish() {}

  return {
    init,
    container,
    update,
    finish,
  };
}

