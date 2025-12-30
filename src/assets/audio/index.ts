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
    
    bgMusic.loop = true;
    bgMusic.volume = 0.5;

    preloads["bgMusic"] = bgMusic;
  }
  
  function get(audioId: string) {
    return preloads[audioId];
  }

  return {
    init,
    get,
  };
}

