import { Container } from "pixi.js";
import { startScene } from "@flow";

import { button } from "@ui/button";
import { text } from "@ui/text";

import { WINDOW_CONFIG } from "@config/window";

export function hub() {
  function container() {
    const container = new Container();
    container.label = "game-ui";

    const playContent = new Container();
    playContent.addChild(text("Play", { x: 0, y: -5 }));
    playContent.scale.set(0.75, 0.75);

    const playGame = button(
      playContent,
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
          posY: WINDOW_CONFIG.height - 60,
        },
        anchor: {
          anchorX: 0,
          anchorY: 1,
        },
      },
    )
    
    container.addChild(playGame);

    return container;
  }

  return {
    container,
  };
}

