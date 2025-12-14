import { Container, Graphics, Ticker } from "pixi.js";

import { WINDOW_CONFIG } from "@config/window";
import { GAME_CONFIG } from "@config/game";
import { ROMEO_CONFIG } from "@config/romeo";
import { TRAJECTORY_CONFIG } from "@config/trajectory";
import { COLORS } from "@config/colors";

import { INSTANCES } from "@instances";
import { LAYER_CONFIG } from "@config/layer";

export function trajectory() {
  const { width } = WINDOW_CONFIG;

  const distance: number = 0.7 * width;
  const {
    pointCount,
    pointRadius,
  } = TRAJECTORY_CONFIG;

  const points = [...Array(pointCount + 1)].map((_, i) => {
    const x = (i / pointCount) * distance;
    const y = 0;

    const point = circle(pointRadius);
    point.position.set(x, y);

    return point;
  });

  function circle(r: number) {
    const circle = new Graphics().circle(0, 0, r);
    circle.fill({
      color: COLORS.TRAJECTORY.CIRCLE,
      alpha: 0.5
    });

    return circle;
  }

  function container() {
    const container = new Container();
    container.label = "trajectoryCircles";

    const { height } = WINDOW_CONFIG;
    const { groundHeight } = GAME_CONFIG;
    const { shape, offset } = ROMEO_CONFIG;

    points.forEach(point => container.addChild(point));

    container.scale.y = -1;
    container.zIndex = LAYER_CONFIG.TRAJECTORY;
    container.position.set(
      offset.x + shape.width + pointRadius * 2,
      height - groundHeight - offset.y - shape.height * 0.75,
    );

    return container;
  }

  function update(_: Ticker) {
    const { trajectoryCurry } = INSTANCES.logics.trajectoryPath.static;
    const { getAngle } = INSTANCES.logics.angle.static;

    const trajectory = trajectoryCurry(120, getAngle());

    points.forEach((point, i) => {
      const x = (i / pointCount) * distance;
      const y = trajectory(x);

      point.position.set(x, y);
    });
  }

  return {
    container,
    update,
  }
}

