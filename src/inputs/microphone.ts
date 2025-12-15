import type { Ticker } from "pixi.js";

interface Note {
  freq: number;
  note: string;
  octave: number;
}

export function microphone() {
  const ctx = new AudioContext();

  let analyser: AnalyserNode | null = null;
  let dataArray: Float32Array;
  let lastFreq: number | null = null;

  let lastTime = 0;
  const INTERVAL = 40;

  const minFreq = 80;
  const maxFreq = 1000;

  const notesQueue: (Note | null)[] = [];
  const notesQueueCapacity = 25;

  async function init() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const source = ctx.createMediaStreamSource(stream);

    analyser = ctx.createAnalyser();
    analyser.fftSize = 1024;
    source.connect(analyser);

    dataArray = new Float32Array(analyser.fftSize);
  }

  function update(_: Ticker) {
    if (!analyser) return;
    if (ctx.state === "suspended")
      ctx.resume();

    analyser.getFloatTimeDomainData(
      dataArray as Float32Array<ArrayBuffer>
    );

    const now = performance.now();
    if (now - lastTime <= INTERVAL) return;
    
    lastTime = now;
    lastFreq = detectFreq(dataArray, ctx.sampleRate);
    
    const note = calculateNote();
    notesQueue.push(note);
    
    if (notesQueue.length > notesQueueCapacity)
      notesQueue.shift();
  }

  function detectFreq(buffer: Float32Array, sampleRate: number) {
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

  function calculateNote() {
    if (!lastFreq)
      return null;

    const A4 = 440;
    const n = Math.round(12 * Math.log2(lastFreq / A4)) + 69;
    const notes = [
      "C", "C#", "D", "D#",
      "E", "F", "F#", "G",
      "G#", "A", "A#", "B",
    ];

    return {
      freq: lastFreq,
      note: notes[n % 12],
      octave: Math.floor(n / 12) - 1,
    };
  }

  function getNote() {
    let significantNote = null;
    let significantNoteCount = 0;

    const noteFrequencies: { [key: string]: number } = {};
    let nullCount = 0;
    
    for (const note of notesQueue) {
      if (!note) {
        nullCount++;
        continue;
      }

      if (!noteFrequencies[note.note])
        noteFrequencies[note.note] = 0;
      noteFrequencies[note.note]++;

      if (noteFrequencies[note.note] > significantNoteCount) {
        significantNoteCount = noteFrequencies[note.note];
        significantNote = note;
      }
    }

    return (nullCount < significantNoteCount)
      ? significantNote
      : null;
  }

  return {
    init,
    update,
    static: {
      getNote,
    },
  };
}