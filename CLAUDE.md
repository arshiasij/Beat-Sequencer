# Beat Sequencer

A browser drum-machine / step sequencer. Single page, Next.js 14 (App Router) + React 18 + TypeScript + Tailwind 3, audio via Howler. Deployed on Vercel: https://beat-sequencer.vercel.app/

## Commands

- `npm run dev` — dev server on http://localhost:3000
- `npm run build` — production build (also type-checks every file under `src/`, including unused ones)
- `npm run lint` — `next lint` (eslint-config-next)

No test suite exists.

## Git workflow

- `master` is the main branch; work happens on `dev` / feature branches (`feat/...`) and merges via PR.
- Commit style: conventional-ish, lowercase (`feat: added options to add rows with select colors`).

## Layout

```
src/app/page.tsx                  Home: title + <RowContainer tileCount={16} />
src/app/layout.tsx                Root layout (metadata still create-next-app defaults)
src/components/
  logic/tilecontext.tsx           TileContext type + createContext (the shared state shape)
  tilebox/rowcontainer.tsx        "use client" root: owns ALL state, provides TileContext
  tilebox/row.tsx                 One instrument row: label + tileCount <Tile>s; re-provides context with its rowIndex
  tilebox/tile.tsx                One step button; reads pattern/color/playhead from context
  tilebox/tilebar.tsx             UNUSED (older bar-grouping component)
  sound/soundplayer.tsx           Playback engine: Howl per row, setInterval step clock
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
- `bpm` (40–300, default 120), `isTriplet`, `barTileCount` (4, but Tile hardcodes `% 4` grouping).
- `instrumentsList` — module-level const of the 6 available instruments. "Used" is derived in `AddRow` from `rows`; max 6 rows, the add panel hides at 6.

## Running / verifying

`.claude/launch.json` has a `dev` config (npm run dev, port 3000) for the browser preview.

`TileContext` carries `rows`, `pattern`, `TileClickHandler(row, col)`, `currentPlayingTile`, `tileCount`, `barTileCount`, and `rowIndex` (overridden per row by `Row`'s nested provider). Components bail out with a "something unexpected has happened" div when context is undefined.

## Playback

`SoundPlayer` builds `Howl`s from `rows` into a ref, and while playing runs `setInterval(playStep, interval)`: plays each row whose `pattern[row][step]` is true, advances the step modulo pattern length, and pushes it to `setCurrentStep`. `Tile` highlights the playhead column (gray, or row color + `brightness-50` if active).

## Conventions / gotchas

- Tailwind classes are built dynamically (`bg-[${hex}]`). Tailwind can't see those, so every selectable color is listed in `safelist` in `tailwind.config.ts` (the CirclePicker defaults). Adding colors ⇒ update the safelist.
- Handlers are PascalCase (`TileClickHandler`, `AddRowHandler`, `HandleMenuClicks`); props interfaces are `XxxProps`.
- Path alias `@/*` → `src/*`.
- Dark UI: page bg `#202329`, empty tile `#3A3F44`, panels `bg-gray-700/800`.

See [docs/known-issues.md](docs/known-issues.md) for bugs and fragile spots found while reading the code.
