import { AUDIO_REGISTRY } from "@assets/audio/registry";

export function audio() {
  const preloads: {
    [key: string]: HTMLAudioElement;
  } = {};

  async function init() {
    for (const asset in AUDIO_REGISTRY) {
      preloads[asset] = new Audio(AUDIO_REGISTRY[asset]);
    }

    const bgClone = preloads["OhMyJuliet"].cloneNode(true);
    const bgMusic = bgClone as HTMLAudioElement;
    preloads["bgMusic"] = bgMusic;
    
    bgMusic.loop = true;
    bgMusic.volume = 0.5;
    
    try {
      await bgMusic.play();
    } catch (_) {
      window.addEventListener(
        "click",
        () => bgMusic.play(),
        { once: true },
      );
    }
  }
  
  function get(audioId: string) {
    return preloads[audioId];
  }

  return {
    init,
    get,
  };
}

