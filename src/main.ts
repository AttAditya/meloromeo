import { Application } from "pixi.js";

import { WINDOW_CONFIG } from "@config/window";
import { RENDERER_CONFIG } from "@config/renderer";

import { INSTANCES, type GenericInstances } from "@instances";

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
  const stage = app.stage;
  const {
    logics,
    entities
  } = INSTANCES as GenericInstances;

  stage.sortableChildren = true;

  Object.values(entities).forEach(entity => {
    stage.addChild(entity.container());
    if (entity.update)
      app.ticker.add(entity.update);
  });

  Object.values(logics).forEach(logic => {
    if (logic.update)
      app.ticker.add(logic.update);
  });
}

main();

