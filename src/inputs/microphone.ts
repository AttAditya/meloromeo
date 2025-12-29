import type { Ticker } from "pixi.js";

type NativeWindow = Window & {
  sendPitch?: (pitch: number | null) => void;
  Native?: {
    startMic: () => void;
    stopMic: () => void;
    switchMic: () => void;
    getMicName: () => string;
  }
};

export function microphone() {
  const ctx = new AudioContext();

  let micList: MediaDeviceInfo[] = [];
  let stream: MediaStream | null = null;
  let analyser: AnalyserNode | null = null;
  let dataArray: Float32Array;
  let lastFreq: number | null = null;

  let currentMicId: string | null = null;
  let lastTime = 0;
  const INTERVAL = 40;

  const minFreq = 80;
  const maxFreq = 1000;

  let nativeMode = false;

  function calculateFrequency(buffer: Float32Array, sampleRate: number) {
    let rms = 0;
    for (let i = 0; i < buffer.length; i++)
      rms += buffer[i] * buffer[i];

    rms = Math.sqrt(rms / buffer.length);
    if (rms < 0.01)
      return null;

    const minOffset = Math.floor(sampleRate / maxFreq);
    const maxOffset = Math.floor(sampleRate / minFreq);

    let bestOffset = -1;
    let bestCorr = 0;

    for (let offset = minOffset; offset <= maxOffset; offset++) {
      let corr = 0;
      for (let i = 0; i < buffer.length - offset; i++)
        corr += buffer[i] * buffer[i + offset];

      if (corr > bestCorr) {
        bestCorr = corr;
        bestOffset = offset;
      }
    }

    return bestOffset > 0
      ? sampleRate / bestOffset
      : null;
  }

  async function browserMicInit() {
    const mediaDevices = navigator.mediaDevices;
    micList = (await mediaDevices.enumerateDevices())
      .filter(device => device.kind === "audioinput");
    
    stream = await mediaDevices.getUserMedia({ 
      audio: currentMicId
        ? { deviceId: { exact: currentMicId } }
        : true 
    });

    const source = ctx.createMediaStreamSource(stream);

    analyser = ctx.createAnalyser();
    analyser.fftSize = 1024;
    source.connect(analyser);

    dataArray = new Float32Array(analyser.fftSize);
  }

  function browserMicUpdate(_: Ticker) {
    if (!analyser) return;

    if (ctx.state === "suspended")
      ctx.resume();

    analyser.getFloatTimeDomainData(
      dataArray as Float32Array<ArrayBuffer>
    );

    const now = performance.now();
    if (now - lastTime <= INTERVAL)
      return;
    
    lastTime = now;
    lastFreq = calculateFrequency(dataArray, ctx.sampleRate);
  }

  async function browserMicFinish() {
    stream?.getTracks().forEach(track => track.stop());
    
    stream = null;
    analyser = null;
    lastFreq = null;
  }

  async function nativeMicInit() {
    (window as NativeWindow).Native?.startMic();
    (window as NativeWindow).sendPitch = (freq: number | null) => {
      const now = performance.now();
      if (now - lastTime <= INTERVAL)
        return;

      lastTime = now;
      lastFreq = freq;
    }
  }
  
  async function init() {
    try {
      await browserMicInit();
    } catch (e) {
      nativeMode = true;
      await nativeMicInit();
    }
  }

  function update(ticker: Ticker) {
    if (!nativeMode)
      browserMicUpdate(ticker);

    console.log("Mic volume:", getVolume());
  }

  async function finish() {
    if (nativeMode) {
      (window as NativeWindow).Native?.stopMic();
      return;
    }

    await browserMicFinish();
  }

  function getVolume() {
    if (!lastFreq) return 0;
    return Math.min(1, lastFreq / maxFreq);
  }

  function getMicId() {
    return !nativeMode
      ? currentMicId
      : (window as NativeWindow).Native?.getMicName() || "default";
  }

  function switchMicrophone() {
    if (nativeMode) {
      (window as NativeWindow).Native?.switchMic();
      return;
    }

    const currentIndex = micList.findIndex(
      mic => mic.deviceId === currentMicId
    );
    
    const nextIndex = (currentIndex + 1) % micList.length;
    currentMicId = micList[nextIndex].deviceId;
  }

  return {
    init,
    update,
    finish,
    static: {
      getVolume,
      getMicId,
      switchMicrophone,
    },
  };
}

