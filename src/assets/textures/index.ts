import { Assets, Texture } from "pixi.js";
import { TEXTURE_REGISTRY } from "@assets/textures/registry";

export function textures() {
  const preloads: {
    [key: string]: Texture;
  } = {};

  async function init() {
    for (const asset in TEXTURE_REGISTRY) {
      preloads[asset] = await Assets.load(
        TEXTURE_REGISTRY[asset],
      );
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

