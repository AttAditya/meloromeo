import { Assets, BitmapFont } from "pixi.js";
import { FONT_REGISTRY } from "@assets/fonts/registry";

export function fonts() {
  const preloads: {
    [key: string]: BitmapFont;
  } = {};

  async function init() {
    for (const asset in FONT_REGISTRY) {
      const fontName = asset;
      Assets.add({ alias: fontName, src: FONT_REGISTRY[asset] });
      preloads[asset] = await Assets.load(fontName) as BitmapFont;
    }
  }
  
  function get(name: string) {
    return preloads[name];
  }

  return {
    init,
    get,
  };
}

