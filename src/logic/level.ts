export function level() {
  const levelUpCallbacks: (() => void)[] = [];

  function onLevelUp(callback: () => void) {
    levelUpCallbacks.push(callback);
  }

  function triggerLevelUp() {
    for (const callback of levelUpCallbacks) {
      callback();
    }
  }

  return {
    static: {
      onLevelUp,
      triggerLevelUp,
    },
  };
}

