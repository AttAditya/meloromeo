import type { Container, Texture, Ticker } from "pixi.js";

import { textures } from "@assets/textures";

import { microphone } from "@inputs/microphone";

import { angle } from "@logic/angle";
import { trajectoryPath } from "@logic/trajectoryPath";
import { positions } from "@logic/positions";
import { triggers } from "@logic/triggers";
import { throwProjectile } from "@logic/throwProjectile";

import { building } from "@entities/building";
import { ground } from "@entities/ground";
import { romeo } from "@entities/romeo";
import { trajectory } from "@entities/trajectory";
import { bird } from "@entities/bird";
import { projectile } from "@entities/projectile";
import { juliet } from "@entities/juliet";
import { balconies } from "@entities/balconies";

import { game } from "@scenes/game";
import { controls } from "@ui/controls";

export const INSTANCES = {
  assets: {
    textures: textures(),
  },
  inputs: {
    microphone: microphone(),
  },
  logics: {
    angle: angle(),
    trajectoryPath: trajectoryPath(),
    positions: positions(),
    triggers: triggers(),
    throwProjectile: throwProjectile(),
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
  },
  ui: {
    controls: controls(),
  },
  scenes: {
    game: game(),
  },
};

export interface AssetInstances {
  textures: {
    init: () => Promise<void>;
    get: (key: string) => Texture;
  };
}

export interface InputInstances {
  [key: string]: {
    static?: { [key: string]: (...args: any[]) => any };
    update?: (ticker: Ticker) => void;
    init?: () => Promise<void>;
  };
}

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

export interface UIInstances {
  [key: string]: {
    container: () => Container;
  };
}

export interface SceneInstances {
  [key: string]: {
    container: () => Container;
    update: (ticker: Ticker) => void;
  };
}

export interface GenericInstances {
  assets: AssetInstances,
  inputs: InputInstances,
  logics: LogicInstances,
  entities: EntityInstances,
  ui: UIInstances,
  scenes: SceneInstances,
}

