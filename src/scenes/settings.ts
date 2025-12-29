import { Container, Graphics, Ticker } from "pixi.js";
import { INSTANCES } from "@instances";
import { startScene } from "@flow";

import { text } from "@ui/text";
import { button } from "@ui/button";

import { WINDOW_CONFIG } from "@config/window";

export function settings() {
  const updateCallbacks: ((ticker: Ticker) => void)[] = [];
  let switchMicBtnContainer = new Container();
  let musicSwitchBtnContainer = new Container();
  let availableMicrophones: MediaDeviceInfo[] = [];

  function background() {
    const background = new Graphics();
    background.rect(
      0, 0,
      WINDOW_CONFIG.width,
      WINDOW_CONFIG.height
    );

    background.fill({
      texture: INSTANCES.assets.textures.get("background"),
      textureSpace: "local",
    });

    background.alpha = 0.6;
    background.scale.set(2.5, 2.5);
    background.position.set(
      - WINDOW_CONFIG.width * 0.66, 0
    );

    return background;
  }

  async function init() {
    try {
      const mediaDevices = navigator.mediaDevices;
      const devices = await mediaDevices.enumerateDevices();
      
      availableMicrophones = devices.filter(
        device => device.kind === 'audioinput'
      );
    } catch (e) {
      console.warn("Could not enumerate devices", e);
    }
  }

  function toggleMusic() {
    const audio = INSTANCES.assets.audio.get("bgMusic");
    if (!audio) return;

    if (audio.paused) {
      audio.play();
      audio.currentTime = 0;
    } else {
      audio.pause();
    }

    const musicEnabled = audio?.paused === false;
    const musicText = text(
      musicEnabled ? "Music: ON" : "Music: OFF",
      { x: 0, y: -5 }, 24, 3
    );
    
    musicSwitchBtnContainer.removeChildren();
    musicSwitchBtnContainer.addChild(musicText);
  }

  function switchMicrophone() {
    if (availableMicrophones.length === 0) {
      console.warn("No microphones available");
      return;
    }

    const { getMicId } = INSTANCES.inputs.microphone.static;
    const currentIndex = availableMicrophones.findIndex(
      mic => mic.deviceId === getMicId()
    );
    
    const nextIndex = (currentIndex + 1) % availableMicrophones.length;
    INSTANCES.inputs.microphone.static.switchMicrophone(
      availableMicrophones[nextIndex].deviceId
    )

    const micLabel = availableMicrophones[nextIndex].label || "Default";
    const micText = text(
      `Mic: ${micLabel.substring(0, 15)}...`,
      { x: 0, y: -5 }, 24, 3
    );

    switchMicBtnContainer.removeChildren();
    switchMicBtnContainer.addChild(micText);
  }

  function container() {
    const world = new Container();
    const container = new Container();
    
    container.label = "settings";

    const title = text("Settings", {
      x: WINDOW_CONFIG.width / 2,
      y: 100,
    });

    const audio = INSTANCES.assets.audio.get("bgMusic");
    const musicEnabled = audio?.paused === false;
    
    const musicContent = new Container();
    const musicText = text(
      musicEnabled ? "Music: ON" : "Music: OFF",
      { x: 0, y: -5 }, 24, 3
    );
    
    musicContent.addChild(musicText);
    musicContent.scale.set(0.75, 0.75);

    const musicButton = button(
      musicContent,
      0xDDDDDD,
      toggleMusic,
      {
        styles: {
          width: WINDOW_CONFIG.width - 40,
          height: 60,
          roundness: 10,
        },
        position: {
          posX: 20,
          posY: 200,
        },
        anchor: {
          anchorX: 0,
          anchorY: 0,
        },
      },
    );

    const micContent = new Container();
    const { getMicId } = INSTANCES.inputs.microphone.static;
    let micLabel = !availableMicrophones.length
      ? "No Microphone"
      : availableMicrophones.find(
        m => m.deviceId === getMicId()
      )?.label || "Default";
    
    if (micLabel.length > 18) {
      micLabel = micLabel.substring(0, 15) + "...";
    }

    const micText = text(
      `Mic: ${micLabel}`,
      { x: 0, y: -5 }, 24, 3
    );
    micContent.addChild(micText);
    micContent.scale.set(0.75, 0.75);

    const micButton = button(
      micContent,
      0xDDDDDD,
      switchMicrophone,
      {
        styles: {
          width: WINDOW_CONFIG.width - 40,
          height: 60,
          roundness: 10,
        },
        position: {
          posX: 20,
          posY: 300,
        },
        anchor: {
          anchorX: 0,
          anchorY: 0,
        },
      },
    );

    const backContent = new Container();
    backContent.addChild(text("Back", { x: 0, y: -5 }, 32, 4));
    backContent.scale.set(0.75, 0.75);

    const backButton = button(
      backContent,
      0xDDDDDD,
      () => startScene("menu"),
      {
        styles: {
          width: WINDOW_CONFIG.width - 40,
          height: 60,
          roundness: 10,
        },
        position: {
          posX: 20,
          posY: WINDOW_CONFIG.height - 60,
        },
        anchor: {
          anchorX: 0,
          anchorY: 1,
        },
      },
    );

    world.addChild(background());
    world.addChild(title);
    world.addChild(musicButton);
    world.addChild(micButton);
    world.addChild(backButton);

    switchMicBtnContainer = micContent;
    musicSwitchBtnContainer = musicContent;

    return world;
  }

  function update(ticker: Ticker) {
    updateCallbacks.forEach(callback => callback(ticker));
  }

  async function finish() {}

  return {
    init,
    container,
    update,
    finish,
  };
}

