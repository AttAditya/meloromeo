import { Assets, Texture } from "pixi.js";
import { ASSET_REGISTRY } from "@assets/assetRegistry";

export function textures() {
  const preloads: {
    [key: string]: Texture;
  } = {};

  async function init() {
    for (const asset in ASSET_REGISTRY) {
      preloads[asset] = await Assets.load(
        ASSET_REGISTRY[asset],
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

