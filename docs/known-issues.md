# Known issues & fragile spots

Observed by reading the code on 2026-11-03 (branch `dev`, with uncommitted WIP). Not yet fixed — verify before relying on any of these.

## Fixed

- `removerow.tsx` was invalid TS and broke `next build`. It's now a valid placeholder component that renders `null`, isn't wired up, and is marked TODO.
- The step interval was 4× too fast. It's now `60000 / bpm / 4` for 16th notes. Triplet mode has since been removed in favour of a time signature selector.
- The tempo box couldn't be typed in, because every keystroke was clamped to the 40 minimum. It now keeps your typing as text and clamps only on Enter or blur. It also has +/− buttons, a slider, and arrow keys (Shift for steps of 10).
- `SoundPlayer` and `AddRow` called hooks after an early return. That was a Rules of Hooks lint error, which also fails `next build`. The guard now comes after the hooks.
- Adding a row with no instrument selected used to push a pattern row with no matching `rows` entry. Now the add button stays disabled until an instrument and a color are picked, and the handler also refuses those cases. The new pattern row uses `tileCount` instead of a hardcoded 16.
- Reset used to rebuild the pattern with a hardcoded 6 rows. It now uses `rows.length`.
- `instrumentsList` used to be recreated each render, and its `Used` flags were mutated. It's now a module-level const with no `Used` field. `AddRow` works out "used" from `rows`, so it can't drift.
- The color button's class used to be `bg-[bg-gray-800]` when no color was picked. It's now `bg-gray-800`.
- Audio broke down over time. Playback used to run on main-thread `setInterval` through Howler, so it was throttled in background tabs, slowed by any jank, and clipped from stacked voices. Every add-row also leaked a full set of `Howl`s. It's now a Web Audio lookahead scheduler, with a Web Worker ticker, a sample cache and a master compressor. Howler has been removed. See "Playback" in CLAUDE.md.
- `SoundPlayer` used to mutate the context object and read a stale closure. It now reads live refs, so toggles and added rows are heard immediately.
- `TileClickHandler` used to mutate the inner row array. It's now immutable.

## React correctness

- Keys use array index (`rowIndex`), which will misbehave once row removal exists.

## Styling

- Layout is cramped on phones and tablets. The page has `px-16` padding, and at 768px the widest signature (12/8, 24 tiles) spills about 30px into the margin.
- Switching to a shorter time signature drops the notes beyond the new length for good. Keeping them hidden in a fixed-length pattern would let you switch back without losing them.

## Leftovers

- `tilebar.tsx` is unused. Unused imports include `Image` in page.tsx, `error from "console"` in row.tsx, and `Tile`/`createContext` in rowcontainer.tsx.
- `layout.tsx` metadata is still "Create Next App".
- README is the create-next-app boilerplate plus the deploy link.
