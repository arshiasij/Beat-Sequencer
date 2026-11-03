# Beat Sequencer

A browser drum-machine / step sequencer. Single page, Next.js 14 (App Router) + React 18 + TypeScript + Tailwind 3, audio via the Web Audio API (no audio library). Deployed on Vercel: https://beat-sequencer.vercel.app/

## Commands

- `npm run dev` — dev server on http://localhost:3000
- `npm run build` — production build (also type-checks every file under `src/`, including unused ones)
- `npm run lint` — `next lint` (eslint-config-next)

No test suite exists.

Node: `package.json` pins `engines.node` to `26.x`, which Vercel reads. Vercel dropped Node 20.x, and its project setting was still 20.x, so deploys failed right after cloning. `engines` overrides the dashboard setting. The app was also built and run on Node 24 locally; `npm` only warns about the mismatch.

## Git workflow

- `master` is the main branch; work happens on `dev` / feature branches (`feat/...`) and merges via PR.
- Commit style: conventional-ish, lowercase (`feat: added options to add rows with select colors`).

## Layout

```
src/app/page.tsx                  Home: title + <RowContainer />
src/app/layout.tsx                Root layout (metadata still create-next-app defaults)
src/components/
  logic/tilecontext.tsx           TileContext type + createContext (the shared state shape)
  logic/timesignatures.ts         Time signature presets (step groups), StepCount, GroupEdges
  controls/tempocontrol.tsx       Tempo box (typeable, arrows, +/-), slider; owns its draft text
  controls/timesignatureselect.tsx  Time signature <select>
  tilebox/rowcontainer.tsx        "use client" root: owns ALL state, provides TileContext
  tilebox/row.tsx                 One instrument row: label + tileCount <Tile>s; re-provides context with its rowIndex
  tilebox/tile.tsx                One step button; reads pattern/color/playhead from context
  tilebox/tilebar.tsx             UNUSED (older bar-grouping component)
  sound/audioengine.ts            Shared AudioContext, sample cache, master gain+compressor, worker ticker
  sound/soundplayer.tsx           Lookahead step scheduler + play/pause/reset
  sound/soundcontrols.tsx         Play/Pause/Reset icon buttons
  addrow/addrow.tsx               "add" panel: pick unused instrument + color, appends a row
  addrow/colorwheel.tsx           react-color CirclePicker wrapper
  removerow/removerow.tsx         WIP placeholder (renders null, not wired in yet)
public/assets/sounds/*.wav        kick, snare, hihat, openhat, clap, tom (+ unused click)
public/assets/icons/*.tsx         SVG icon components (imported via relative ../../../public path)
```

## Data model (all state lives in `RowContainer`)

- `rows: { instrumentName, soundPath, color }[]` — visible rows; starts with kick/snare/hihat. `color` is a Tailwind class string (`bg-green-700` or `bg-[#hex]`).
- `selected` (exposed as `pattern` in context): `boolean[][]`, `pattern[rowIndex][step]`. Must stay index-aligned with `rows`.
- `currentStep` (exposed as `currentPlayingTile`): playhead index, `-1` when stopped/reset.
- `bpm` (40–300, default 120). Tempo is per quarter note.
- `timeSignature` (default 4/4): `{ label, groups }`, where `groups` is the number of 16th-note steps in each beat group, e.g. 6/8 = `[6, 6]`, 7/8 = `[4, 4, 6]`. `tileCount = StepCount(groups)` is derived, never stored. `Tile` draws each group as a rounded block using `GroupEdges`. Every step is a 16th note whatever the signature, so 6/8 at 120 BPM has eighth notes at 240 per minute. To add a signature, add an entry to `timeSignatures`.
- Changing the time signature (`TimeSignatureChangeHandler`) resizes every row's pattern: notes that still fit are kept, steps beyond the new length are dropped and don't come back when you go back to a longer bar.
- `instrumentsList` — module-level const of the 6 available instruments. "Used" is derived in `AddRow` from `rows`; max 6 rows, the add panel hides at 6.

`TileContext` carries `rows`, `pattern`, `TileClickHandler(row, col)`, `currentPlayingTile`, `tileCount`, `groups`, and `rowIndex` (overridden per row by `Row`'s nested provider). Components bail out with a "something unexpected has happened" div when context is undefined. Pattern updates are immutable (`TileClickHandler` maps to new arrays).

## Playback

The lookahead scheduler pattern ("A Tale of Two Clocks"):

- `audioengine.ts` holds one `AudioContext`. Samples are fetched and decoded once per path (`LoadSample`, cached) and read synchronously with `GetLoadedSample`. Every hit goes `BufferSource → master gain (0.8) → compressor → destination`, so stacked voices don't clip. The samples themselves peak at about 1.0.
- `SoundPlayer` starts a ticker when you press play. The ticker is a Web Worker `setInterval` every 25ms, so it isn't throttled in background tabs; it falls back to the main thread if workers fail. Each tick schedules every step that falls within the next 100ms, at its exact time on the audio clock (`source.start(when)`). Main-thread jank shorter than about 100ms has no audible effect.
- The scheduler reads `pattern`, `rows`, step length and `tileCount` through refs that are refreshed every render. Tile toggles, added rows, BPM changes and time signature changes (the loop length) take effect on the next step without restarting. Only `isPlaying` restarts the effect, which is why the deps lint rule is disabled there on purpose.
- The playhead comes from a queue of `{step, time}` that `requestAnimationFrame` drains, so it moves when a step is actually heard. rAF doesn't run in hidden tabs or a hidden preview pane, so the playhead freezes there while the audio keeps going.
- Pause stops any sources already scheduled in the lookahead window. Resume continues from `currentPlayingTile + 1`. If the scheduler falls behind the audio clock, it skips the missed steps instead of firing them all at once.
- The `AudioContext` is created on mount to decode samples, and resumed when you click play, because browsers require a user gesture to start audio.

## Running / verifying

`.claude/launch.json` has a `dev` config (npm run dev, port 3000) for the browser preview. Don't run `npm run build` while the dev server is up, because both write `.next`. Use `npx tsc --noEmit` and `npx next lint` instead, or restart the dev server afterwards. To check timing, patch `AudioBufferSourceNode.prototype.start` in the page and record the `when` values.

## Conventions / gotchas

- Tailwind classes are built dynamically (`bg-[${hex}]`). Tailwind can't see those, so every selectable color is listed in `safelist` in `tailwind.config.ts` (the CirclePicker defaults). Adding colors ⇒ update the safelist.
- Handlers are PascalCase (`TileClickHandler`, `AddRowHandler`, `HandleMenuClicks`); props interfaces are `XxxProps`.
- Path alias `@/*` → `src/*`.
- Dark UI: page bg `#202329`, empty tile `#3A3F44`, panels `bg-gray-700/800`.

See [docs/known-issues.md](docs/known-issues.md) for bugs and fragile spots found while reading the code.
