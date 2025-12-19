import { Assets, BitmapFont } from "pixi.js";
import { FONT_REGISTRY } from "@assets/fonts/registry";

export function fonts() {
  const preloads: {
    [key: string]: BitmapFont;
  } = {};

  async function init() {
    for (const asset in FONT_REGISTRY) {
      preloads[asset] = await Assets.load({
        src: FONT_REGISTRY[asset],
      });
    }

  }
  
  function get(name: string) {
    console.log(preloads);
    return preloads[name];
  }

  return {
    init,
    get,
  };
}

