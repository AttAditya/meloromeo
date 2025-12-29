import { Container, Graphics, Ticker } from "pixi.js";
import { INSTANCES } from "@instances";
import { startScene } from "@flow";

import { text } from "@ui/text";
import { button } from "@ui/button";

import { WINDOW_CONFIG } from "@config/window";

export function win() {
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
    
    const title = text("Juliet liked\nthe flowers!", {
      x: WINDOW_CONFIG.width / 2,
      y: 200,
    });

    const playAgainContent = new Container();
    playAgainContent.addChild(text("Play Again", { x: 0, y: -5 }));
    playAgainContent.scale.set(0.75, 0.75);

    const playAgainButton = button(
      playAgainContent,
      0xDDDDDD,
      () => startScene("game"),
      {
        styles: {
          width: WINDOW_CONFIG.width - 40,
          height: 60,
          roundness: 10,
        },
        position: {
          posX: 20,
          posY: WINDOW_CONFIG.height - 160,
        },
        anchor: {
          anchorX: 0,
          anchorY: 1,
        },
      },
    );

    const menuContent = new Container();
    menuContent.addChild(text("Main Menu", { x: 0, y: -5 }));
    menuContent.scale.set(0.75, 0.75);

    const menuButton = button(
      menuContent,
      0xDDDDDD,
      () => startScene("menu"),
      {
        styles: {
          width: WINDOW_CONFIG.width - 40,
          height: 60,
          roundness: 10,
        },
        position: {
          posX: 20,
          posY: WINDOW_CONFIG.height - 60,
        },
        anchor: {
          anchorX: 0,
          anchorY: 1,
        },
      },
    );

    world.addChild(background());
    world.addChild(title);
    world.addChild(playAgainButton);
    world.addChild(menuButton);

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

