/**
 * Horspool String Matching Algorithm
 * A simplification of Boyer-Moore using only a bad-character shift table.
 *
 * Time complexity: O(n*m) worst case, O(n/m) average case
 * Space complexity: O(k) where k = alphabet size (4 for DNA: A, T, G, C)
 *
 * @author GeneTrace Lab
 */

// Step 1: Build the bad-character shift table
export function buildShiftTable(pattern) {
  const m = pattern.length;
  const table = {};
  // For each character except the last, store how far we'd need to shift
  for (let i = 0; i < m - 1; i++) {
    table[pattern[i]] = m - 1 - i;
  }
  return table;
}

// Step 2: Search using Horspool's algorithm, returning full trace for visualization
export function horspoolSearch(text, pattern) {
  const n = text.length;
  const m = pattern.length;
  const matches = [];
  const steps = [];
  let comparisons = 0;
  let shifts = 0;
  let skippedComparisons = 0;

  if (m === 0 || m > n) {
    return {
      matches, steps, comparisons: 0, shifts: 0,
      skippedComparisons: 0, shiftTable: {}, executionTime: 0,
    };
  }

  const shiftTable = buildShiftTable(pattern);
  const t0 = performance.now();

  let i = m - 1; // Align pattern's last char with text position i

  while (i < n) {
    let k = 0;
    const stepComparisons = [];

    // Compare from right to left
    while (k < m && pattern[m - 1 - k] === text[i - k]) {
      comparisons++;
      stepComparisons.push({ textIdx: i - k, patternIdx: m - 1 - k, matched: true });
      k++;
    }

    if (k < m) {
      // Record the mismatch comparison
      comparisons++;
      stepComparisons.push({ textIdx: i - k, patternIdx: m - 1 - k, matched: false });
    }

    const alignmentStart = i - m + 1;
    const fullMatch = k === m;
    if (fullMatch) matches.push(alignmentStart);

    // Look up the shift from the bad-character table
    const badChar = text[i];
    const shift = shiftTable[badChar] !== undefined ? shiftTable[badChar] : m;
    if (shift > 1) skippedComparisons += (shift - 1);

    steps.push({
      alignmentStart,
      patternAligned: pattern,
      comparisons: stepComparisons,
      fullMatch,
      shift,
      badChar,
      textIndex: i,
    });

    i += shift;
    shifts++;
  }

  const executionTime = performance.now() - t0;
  return {
    matches, steps, comparisons, shifts,
    skippedComparisons, shiftTable, executionTime,
  };
}

// Naive string matching for benchmarking
export function naiveSearch(text, pattern) {
  const n = text.length;
  const m = pattern.length;
  const matches = [];
  let comparisons = 0;
  const t0 = performance.now();

  for (let i = 0; i <= n - m; i++) {
    let j = 0;
    while (j < m) {
      comparisons++;
      if (text[i + j] !== pattern[j]) break;
      j++;
    }
    if (j === m) matches.push(i);
  }

  return { matches, comparisons, executionTime: performance.now() - t0 };
}

// Detect mutations between original and mutated DNA
export function detectMutations(original, mutated) {
  const len = Math.min(original.length, mutated.length);
  const mutations = [];

  for (let i = 0; i < len; i++) {
    if (original[i] !== mutated[i]) {
      mutations.push({ position: i, from: original[i], to: mutated[i] });
    }
  }

  const lengthDiff = Math.abs(original.length - mutated.length);
  const totalLen = Math.max(original.length, mutated.length);
  const similarity = totalLen === 0
    ? 100
    : ((totalLen - mutations.length - lengthDiff) / totalLen) * 100;

  return { mutations, similarity, lengthDiff, comparedLength: len };
}

// Calculate similarity between two sequences
export function calculateSimilarity(seq1, seq2) {
  const result = detectMutations(seq1, seq2);
  return result.similarity;
}

// Validate DNA sequence
export function validateDNA(seq) {
  return /^[ATGC]*$/i.test(seq);
}

// Predefined disease markers
export const DISEASE_MARKERS = [
  { name: 'BRCA1 fragment', pattern: 'AGCT', disease: 'Breast Cancer risk marker', color: '#f87171' },
  { name: 'TP53 fragment', pattern: 'CGGCGG', disease: 'Tumor suppressor mutation site', color: '#fb923c' },
  { name: 'Sickle Cell (HbS)', pattern: 'GTG', disease: 'Sickle-cell anemia codon', color: '#facc15' },
  { name: 'CFTR fragment', pattern: 'CTTT', disease: 'Cystic Fibrosis marker', color: '#34d399' },
  { name: "HTT repeat", pattern: 'CAG', disease: "Huntington's disease repeat", color: '#a78bfa' },
];
