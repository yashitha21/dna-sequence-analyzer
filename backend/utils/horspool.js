/**
 * Horspool String Matching Algorithm (server-side)
 * Mirrors frontend/src/utils/horspool.js
 */

function buildShiftTable(pattern) {
  const m = pattern.length;
  const table = {};
  for (let i = 0; i < m - 1; i++) {
    table[pattern[i]] = m - 1 - i;
  }
  return table;
}

function horspoolSearch(text, pattern) {
  const n = text.length;
  const m = pattern.length;
  const matches = [];
  let comparisons = 0;
  let shifts = 0;
  let skippedComparisons = 0;

  if (m === 0 || n < m) {
    return { matches, comparisons, shifts, skippedComparisons, shiftTable: {}, executionTime: 0 };
  }

  const shiftTable = buildShiftTable(pattern);
  const t0 = (typeof performance !== 'undefined' ? performance.now() : Date.now());
  let i = m - 1;

  while (i < n) {
    let k = 0;
    while (k < m && pattern[m - 1 - k] === text[i - k]) {
      k++;
      comparisons++;
    }
    if (k < m) comparisons++;

    if (k === m) {
      matches.push(i - m + 1);
      i += 1;
    } else {
      const badChar = text[i];
      const shift = shiftTable[badChar] !== undefined ? shiftTable[badChar] : m;
      skippedComparisons += Math.max(0, shift - 1);
      i += shift;
      shifts++;
    }
  }

  const t1 = (typeof performance !== 'undefined' ? performance.now() : Date.now());
  return { matches, comparisons, shifts, skippedComparisons, shiftTable, executionTime: +(t1 - t0).toFixed(3) };
}

function naiveSearch(text, pattern) {
  const n = text.length;
  const m = pattern.length;
  const matches = [];
  let comparisons = 0;
  const t0 = (typeof performance !== 'undefined' ? performance.now() : Date.now());

  for (let i = 0; i <= n - m; i++) {
    let j = 0;
    while (j < m) {
      comparisons++;
      if (text[i + j] !== pattern[j]) break;
      j++;
    }
    if (j === m) matches.push(i);
  }

  const t1 = (typeof performance !== 'undefined' ? performance.now() : Date.now());
  return { matches, comparisons, executionTime: +(t1 - t0).toFixed(3) };
}

function detectMutations(original, mutated) {
  const mutations = [];
  const len = Math.min(original.length, mutated.length);
  for (let i = 0; i < len; i++) {
    if (original[i] !== mutated[i]) {
      mutations.push({ position: i, original: original[i], mutated: mutated[i] });
    }
  }
  return mutations;
}

function calculateSimilarity(a, b) {
  const len = Math.max(a.length, b.length);
  if (!len) return 100;
  let matches = 0;
  for (let i = 0; i < Math.min(a.length, b.length); i++) if (a[i] === b[i]) matches++;
  return +((matches / len) * 100).toFixed(2);
}

function validateDNA(seq) {
  return /^[ATGC]*$/i.test(seq);
}

module.exports = {
  buildShiftTable,
  horspoolSearch,
  naiveSearch,
  detectMutations,
  calculateSimilarity,
  validateDNA,
};
