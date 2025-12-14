import { Application } from "pixi.js";
import { INSTANCES, type LogicInstances } from "@instances";

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
  const logics = INSTANCES.logics as LogicInstances;
  const world = INSTANCES.entities.world;

  app.stage.addChild(world.container());
  app.ticker.add(world.update);

  Object.values(logics).forEach(logic => {
    if (logic.update)
      app.ticker.add(logic.update);
  });
}

main();

