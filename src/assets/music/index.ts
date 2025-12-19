import { MUSIC_REGISTRY } from "@assets/music/registry";

export function music() {
  async function init() {
    const bgMusic = new Audio(MUSIC_REGISTRY.OhMyJuliet);
    
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
  
  function get(_: string) {}

  return {
    init,
    get,
  };
}

