import { Application } from "pixi.js";
import { INSTANCES, type GenericInstances } from "@instances";

import { WINDOW_CONFIG } from "@config/window";
import { RENDERER_CONFIG } from "@config/renderer";

async function setup(): Promise<Application> {
  const app = new Application();
  await app.init({
    ...WINDOW_CONFIG,
    ...RENDERER_CONFIG,
  });
  
  document.body.appendChild(app.canvas);
  return app;
}

async function main() {
  const app = await setup();
  const {
    assets,
    inputs,
    logics,
    scenes,
  } = INSTANCES as GenericInstances;

  const inputList = Object.values(inputs);
  const assetList = Object.values(assets);
  const logicList = Object.values(logics);

  for (const asset of assetList)
    await asset.init();

  for (const input of inputList) {
    if (input.init)
      await input.init();

    if (input.update)
      app.ticker.add(input.update);
  }

  for (const logic of logicList)
    if (logic.update)
      app.ticker.add(logic.update);

  const scene = scenes.game;
  app.stage.addChild(scene.container());
  app.ticker.add(scene.update!);
}

main();

