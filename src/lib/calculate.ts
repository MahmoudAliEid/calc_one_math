import { normalizeArabicText } from './rules';

// ─────────────────────────────────────────────────────────────
// Interfaces
// ─────────────────────────────────────────────────────────────

export interface CharAnalysis {
  char: string;
  positions: number[];
  step2Values: string[];
  squares: string[];
  groupedValue: string;
}

export interface SequenceStep {
  char: string;
  originalIndex: number;
  step2Value: string;
  indexSquared: string;
  groupedValue: string;
  multiplicationResult: string;
}

export interface CalculationResult {
  original: string;
  normalized: string;
  charAnalysis: CharAnalysis[];
  sequence: SequenceStep[];
  grandTotal: string;
  reductionSteps: string[];
  finalReduced: number;
}

// ─────────────────────────────────────────────────────────────
// Main calculation function
// ─────────────────────────────────────────────────────────────

export function calculateArabicPower(text: string): CalculationResult {
  const normalized = normalizeArabicText(text);
  if (normalized.length === 0) {
    throw new Error('يجب أن يحتوي النص على أحرف عربية');
  }

  const n = normalized.length;
  const indices: bigint[] = [];
  const step2Vals: bigint[] = [];
  const squares: bigint[] = [];
  
  for (let i = 0; i < n; i++) {
    const idxBig = BigInt(i + 1);
    indices.push(idxBig);
    
    // Step 2: Multiply index by 8
    const step2Value = idxBig * BigInt(8);
    step2Vals.push(step2Value);
    
    // Step 3: Square the value from Step 2
    squares.push(step2Value * step2Value);
  }

  // ── Step 4: Character Value Summation (Grouping) ──
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
    const step2Strings: string[] = [];
    const charSquares: string[] = [];
    for (let i = 0; i < n; i++) {
      if (normalized[i] === char) {
        positions.push(i + 1);
        step2Strings.push(step2Vals[i].toString());
        charSquares.push(squares[i].toString());
      }
    }
    return {
      char,
      positions,
      step2Values: step2Strings,
      squares: charSquares,
      groupedValue: groupedValuesMap.get(char)!.toString(),
    };
  });

  // ── Step 5: Cross-Multiplication & Grand Total ──
  const sequence: SequenceStep[] = [];
  let grandTotal = BigInt(0);

  for (let i = 0; i < n; i++) {
    const char = normalized[i];
    const originalIndex = i + 1;
    const step2Value = step2Vals[i];
    const indexSquared = squares[i].toString();
    const groupedValue = groupedValuesMap.get(char)!;
    
    // Multiply Step 1 Value by Grouped Value
    const step1Value = BigInt(originalIndex);
    const multiplicationResult = step1Value * groupedValue;
    
    grandTotal += multiplicationResult;

    sequence.push({
      char,
      originalIndex,
      step2Value: step2Value.toString(),
      indexSquared,
      groupedValue: groupedValue.toString(),
      multiplicationResult: multiplicationResult.toString(),
    });
  }

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