import { Application } from "pixi.js";

import { INSTANCES, type GenericInstances } from "@instances";
import { initFlow, startScene } from "@flow";

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
  const { assets, logics } = INSTANCES as GenericInstances;

  const assetList = Object.values(assets);
  const logicList = Object.values(logics);

  for (const asset of assetList)
    await asset.init();

  for (const logic of logicList)
    if (logic.update)
      app.ticker.add(logic.update);

  initFlow(app);
  startScene("menu");
}

main();

