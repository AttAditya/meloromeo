export function triggers() {
  const triggers: {
    [event: string]: { [triggerName: string]: () => void }
  } = {};

  function register(
    event: string,
    triggerName: string,
    callback: () => void,
  ) {
    if (!triggers[event]) triggers[event] = {};
    triggers[event][triggerName] = callback;
  }

  function remove(event: string, triggerName: string) {
    const callbacks = triggers[event];
    if (callbacks && callbacks[triggerName])
      delete triggers[event][triggerName];
  }

  function trigger(event: string) {
    const callbacks = triggers[event] || {};
    for (const triggerName in callbacks)
      callbacks[triggerName]();
  }

  return {
    static: {
      register,
      remove,
      trigger,
    },
  };
}

