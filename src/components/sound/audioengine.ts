// Shared Web Audio graph: one AudioContext, samples decoded once and cached by path,
// and every hit summed through a master gain + compressor so stacked voices don't clip.

let context: AudioContext | null = null;
let master: GainNode | null = null;
const loading = new Map<string, Promise<AudioBuffer>>();
const decoded = new Map<string, AudioBuffer>();

export function GetAudioContext() {
  if (context === null) {
    context = new AudioContext({ latencyHint: "interactive" });

    const compressor = context.createDynamicsCompressor();
    compressor.threshold.value = -10;
    compressor.knee.value = 6;
    compressor.ratio.value = 12;
    compressor.attack.value = 0.003;
    compressor.release.value = 0.1;

    master = context.createGain();
    master.gain.value = 0.8;
    master.connect(compressor);
    compressor.connect(context.destination);
  }
  return context;
}

// Starts fetching + decoding a sample if it isn't already cached
export function LoadSample(path: string) {
  let buffer = loading.get(path);
  if (buffer === undefined) {
    const ctx = GetAudioContext();
    buffer = fetch(path)
      .then((response) => response.arrayBuffer())
      .then((data) => ctx.decodeAudioData(data))
      .then((result) => {
        decoded.set(path, result);
        return result;
      })
      .catch((error) => {
        loading.delete(path); // allow a retry next time
        throw error;
      });
    loading.set(path, buffer);
  }
  return buffer;
}

// Synchronous lookup for the scheduler; undefined until the sample has decoded
export function GetLoadedSample(path: string) {
  return decoded.get(path);
}

// Plays a buffer at an exact time on the audio clock
export function PlaySample(buffer: AudioBuffer, when: number) {
  const ctx = GetAudioContext();
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.connect(master!);
  source.start(when);
  return source;
}

// Calls onTick every intervalMs from a Web Worker, whose timers keep running when the
// tab is in the background (main-thread timers get throttled to ~1/s there).
// Falls back to setInterval if workers aren't available. Returns a stop function.
export function StartTicker(onTick: () => void, intervalMs: number) {
  try {
    const source = `let id = null;
      onmessage = (e) => {
        clearInterval(id);
        if (e.data === "start") id = setInterval(() => postMessage("tick"), ${intervalMs});
      };`;
    const url = URL.createObjectURL(new Blob([source], { type: "text/javascript" }));
    const worker = new Worker(url);
    worker.onmessage = onTick;
    worker.postMessage("start");
    return () => {
      worker.terminate();
      URL.revokeObjectURL(url);
    };
  } catch {
    const id = setInterval(onTick, intervalMs);
    return () => clearInterval(id);
  }
}
