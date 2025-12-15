export function throwProjectile() {
  const throwCallbacks: {
    [key: string]: () => void;
  } = {};

  function registerThrow(id: string, callback: () => void) {
    throwCallbacks[id] = callback;
  }

  function throwById(id: string) {
    throwCallbacks[id]?.();
  }

  return {
    static: {
      registerThrow,
      throwById,
    },
  };
}

