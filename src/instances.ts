import type { Container, Ticker } from "pixi.js";

import { angle } from "@logic/angle";
import { trajectoryPath } from "@logic/trajectoryPath";
import { positions } from "@logic/positions";
import { level } from "@logic/level";

import { building } from "@entities/building";
import { ground } from "@entities/ground";
import { romeo } from "@entities/romeo";
import { trajectory } from "@entities/trajectory";
import { bird } from "@entities/bird";
import { projectile } from "@entities/projectile";
import { juliet } from "@entities/juliet";
import { balconies } from "@entities/balconies";
import { world } from "@entities/world";

export const INSTANCES = {
  logics: {
    angle: angle(),
    trajectoryPath: trajectoryPath(),
    positions: positions(),
    level: level(),
  },
  entities: {
    bird: bird(),
    building: building(),
    balconies: balconies(),
    ground: ground(),
    romeo: romeo(),
    trajectory: trajectory(),
    projectile: projectile(),
    juliet: juliet(),
    world: world(),
  },
};

export interface LogicInstances {
  [key: string]: {
    static?: { [key: string]: (...args: any[]) => any };
    update?: (ticker: Ticker) => void;
  };
}

export interface EntityInstances {
  [key: string]: {
    container: () => Container;
    update?: (ticker: Ticker) => void;
  };
}

export interface GenericInstances {
  logics: LogicInstances,
  entities: EntityInstances,
}

