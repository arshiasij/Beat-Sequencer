# Known issues & fragile spots

Observed by reading the code on 2026-11-03 (branch `dev`, with uncommitted WIP). Not yet fixed — verify before relying on any of these.

## Fixed

- `removerow.tsx` was invalid TS and broke `next build`. It's now a valid placeholder component that renders `null`, isn't wired up, and is marked TODO.
- The step interval was 4× too fast. It's now `60000 / bpm / 4` for 16ths, or `/ 6` for 16th-note triplets.
- `SoundPlayer` and `AddRow` called hooks after an early return. That was a Rules of Hooks lint error, which also fails `next build`. The guard now comes after the hooks.
- Adding a row with no instrument selected used to push a pattern row with no matching `rows` entry. Now the add button stays disabled until an instrument and a color are picked, and the handler also refuses those cases. The new pattern row uses `tileCount` instead of a hardcoded 16.
- Reset used to rebuild the pattern with a hardcoded 6 rows. It now uses `rows.length`.
- `instrumentsList` used to be recreated each render, and its `Used` flags were mutated. It's now a module-level const with no `Used` field. `AddRow` works out "used" from `rows`, so it can't drift.
- The color button's class used to be `bg-[bg-gray-800]` when no color was picked. It's now `bg-gray-800`.

## Timing

- `setInterval` drifts and doesn't reschedule cleanly; a Web Audio lookahead scheduler would be more accurate if timing matters.

## React correctness

- `SoundPlayer` writes to the context object (`tileContext.currentPlayingTile = ...`) and the interval closure captures the context from when playback started (the effect deps don't include `pattern`/`rows`). Tile toggles still sound only because `TileClickHandler` mutates the inner arrays in place. Rows added during playback aren't heard until stop/play.
- `TileClickHandler` shallow-copies the outer array but mutates the inner row array, which is a state mutation.
- Keys use array index (`rowIndex`), which will misbehave once row removal exists.

## Styling

- `Tile` hardcodes bar grouping with `index % 4` instead of using `barTileCount`.

## Leftovers

- `tilebar.tsx` is unused. Unused imports include `Image` in page.tsx, `error from "console"` in row.tsx, and `Howl`/`Tile`/`createContext` in rowcontainer.tsx.
- `layout.tsx` metadata is still "Create Next App".
- README is the create-next-app boilerplate plus the deploy link.
