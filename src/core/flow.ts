import { Container, Application, Ticker } from "pixi.js";
import { INSTANCES, type SceneInstances } from "@instances";

let flowContainer: Container = new Container();
let updateCallback: (ticker: Ticker) => void = () => {};
let currentSceneName: string = "";

function initFlow(app: Application) {
  app.stage.addChild(flowContainer);
  app.ticker.add((ticker) => {
    updateCallback(ticker);
  });
}

async function startScene(name: string) {
  const scenes = INSTANCES.scenes as SceneInstances;
  const scene = scenes[name];

  if (!scene) return;
  const container = scene.container();

  await scenes[currentSceneName]?.finish();
  flowContainer.removeChildren();
  await scene.init();

  flowContainer.addChild(container);
  updateCallback = scene.update;
  currentSceneName = name;
}

export { initFlow, startScene };

