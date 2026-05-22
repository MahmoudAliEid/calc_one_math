import { normalizeArabicText } from './rules';

// ─────────────────────────────────────────────────────────────
// Interfaces
// ─────────────────────────────────────────────────────────────

/**
 * Step 1, 2, 3 — Character analysis for each unique character:
 * its normalized form, the positions where it appeared, 
 * the squared values of these positions, and their grouped sum.
 */
export interface CharAnalysis {
  char: string;                  // The normalized character (e.g. 'ج')
  positions: number[];           // 1-indexed sequential positions from Step 1 (e.g. [1, 4])
  squares: string[];             // Squared values from Step 2 as string (e.g. ["1", "16"])
  groupedValue: string;          // Summed squared value from Step 3 as string (e.g. "17")
}

/**
 * Step 4 — Each position in the original sentence mapped to its index, 
 * squared index, the character's grouped value, and cross-multiplication result.
 */
export interface SequenceStep {
  char: string;                  // The normalized character (e.g. 'ج')
  originalIndex: number;         // 1-based sequential index from Step 1 (e.g. 1)
  indexSquared: string;          // Squared index from Step 2 as string (e.g. "1")
  groupedValue: string;          // Character's grouped value from Step 3 as string (e.g. "17")
  multiplicationResult: string;  // Product: originalIndex * groupedValue (e.g. "17")
}

/**
 * Complete calculation result across all 4 steps.
 */
export interface CalculationResult {
  original: string;              // Original input text
  normalized: string;            // Cleaned and normalized text
  
  // Step 1, 2 & 3: Character analyses
  charAnalysis: CharAnalysis[];
  
  // Step 4 details
  sequence: SequenceStep[];      // Step 4 cross-multiplication for each position
  grandTotal: string;            // Total sum of all cross-multiplication results (e.g. "1110")
  reductionSteps: string[];      // Reduction steps of grand total to single digit (e.g. ["1110", "3"])
  finalReduced: number;          // Final single-digit (1 to 9) (e.g. 3)
}

// ─────────────────────────────────────────────────────────────
// Main calculation function
// ─────────────────────────────────────────────────────────────

/**
 * Calculates the Arabic Numerology / Jafr value using the 4-step algorithm:
 *
 * **Step 1: Character Indexing**
 *   Clean text and assign a 1-based index to each character (1, 2, ..., N).
 *
 * **Step 2: Index Squaring**
 *   Calculate the square of the index for each position (Position_Index * Position_Index).
 *
 * **Step 3: Character Value Summation (Grouping)**
 *   Group unique characters and sum their squared positions.
 *
 * **Step 4: Cross-Multiplication, Total Sum & Final Single-Digit Reduction**
 *   For each character position, multiply its original index by its character's grouped value.
 *   Sum all multiplication results to get the "Grand Total".
 *   Apply digital root reduction on the Grand Total to reach a single-digit (1-9).
 */
export function calculateArabicPower(text: string): CalculationResult {
  // ── Step 0: Clean and Normalize ──
  const normalized = normalizeArabicText(text);
  if (normalized.length === 0) {
    throw new Error('يجب أن يحتوي النص على أحرف عربية');
  }

  // ── Step 1 & 2: Sequential Indexing and Squaring ──
  const n = normalized.length;
  const indices: bigint[] = [];
  const squares: bigint[] = [];
  
  for (let i = 0; i < n; i++) {
    const idxBig = BigInt(i + 1);
    indices.push(idxBig);
    squares.push(idxBig * idxBig);
  }

  // ── Step 3: Character Value Summation (Grouping) ──
  const uniqueChars: string[] = [];
  const seenChars = new Set<string>();
  
  for (let i = 0; i < n; i++) {
    const char = normalized[i];
    if (!seenChars.has(char)) {
      seenChars.add(char);
      uniqueChars.push(char);
    }
  }

  const groupedValuesMap = new Map<string, bigint>();
  uniqueChars.forEach(char => {
    let sum = BigInt(0);
    for (let i = 0; i < n; i++) {
      if (normalized[i] === char) {
        sum += squares[i];
      }
    }
    groupedValuesMap.set(char, sum);
  });

  const charAnalysis: CharAnalysis[] = uniqueChars.map(char => {
    const positions: number[] = [];
    const charSquares: string[] = [];
    for (let i = 0; i < n; i++) {
      if (normalized[i] === char) {
        positions.push(i + 1);
        charSquares.push(squares[i].toString());
      }
    }
    return {
      char,
      positions,
      squares: charSquares,
      groupedValue: groupedValuesMap.get(char)!.toString(),
    };
  });

  // ── Step 4: Cross-Multiplication & Grand Total ──
  const sequence: SequenceStep[] = [];
  let grandTotal = BigInt(0);

  for (let i = 0; i < n; i++) {
    const char = normalized[i];
    const originalIndex = i + 1;
    const indexSquared = squares[i].toString();
    const groupedValue = groupedValuesMap.get(char)!;
    const multiplicationResult = BigInt(originalIndex) * groupedValue;
    
    grandTotal += multiplicationResult;

    sequence.push({
      char,
      originalIndex,
      indexSquared,
      groupedValue: groupedValue.toString(),
      multiplicationResult: multiplicationResult.toString(),
    });
  }

  // Digital root reduction of the grandTotal
  const reduction = reduceToSingleDigit(grandTotal);

  return {
    original: text,
    normalized,
    charAnalysis,
    sequence,
    grandTotal: grandTotal.toString(),
    reductionSteps: reduction.steps,
    finalReduced: reduction.finalResult,
  };
}

/**
 * Reduce a BigInt to a single digit (1-9) using digital root.
 */
function reduceToSingleDigit(bigSum: bigint): { finalResult: number; steps: string[] } {
  let str = bigSum.toString();
  const steps: string[] = [str];
  
  while (str.length > 1) {
    let currentSum = BigInt(0);
    for (const char of str) {
      currentSum += BigInt(char);
    }
    str = currentSum.toString();
    steps.push(str);
  }
  
  return {
    finalResult: Number(str),
    steps,
  };
}