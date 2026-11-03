// The grid is always 16th-note steps. A time signature decides how many steps there are
// and how they are grouped (each group is drawn as one block of tiles and is one "beat").
export interface TimeSignature {
  label: string;
  groups: number[];
}

export const timeSignatures: TimeSignature[] = [
  { label: "2/4", groups: [4, 4] },
  { label: "3/4", groups: [4, 4, 4] },
  { label: "4/4", groups: [4, 4, 4, 4] },
  { label: "5/4", groups: [4, 4, 4, 4, 4] },
  { label: "6/8", groups: [6, 6] },
  { label: "7/8", groups: [4, 4, 6] }, // 2+2+3 eighths
  { label: "9/8", groups: [6, 6, 6] },
  { label: "12/8", groups: [6, 6, 6, 6] },
];

export const defaultTimeSignature = timeSignatures[2];

export function StepCount(groups: number[]) {
  return groups.reduce((total, size) => total + size, 0);
}

// Whether a step is the first / last tile of its group
export function GroupEdges(groups: number[], index: number) {
  let start = 0;
  for (const size of groups) {
    if (index < start + size) {
      return { first: index === start, last: index === start + size - 1 };
    }
    start += size;
  }
  return { first: false, last: false };
}
