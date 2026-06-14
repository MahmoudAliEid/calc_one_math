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
  additionResult: string;
}

export interface CalculationResult {
  original: string;
  normalized: string;
  charAnalysis: CharAnalysis[];
  sequence: SequenceStep[];
  grandTotal: string;
  step6Numerator: string;
  step6Denominator: string;
  step6ExactStr: string;
  step6Scientific: string;
  reductionSteps: string[];
  finalReduced: string;
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
    
    // Step 2: Multiply index by 4
    const step2Value = idxBig * BigInt(4);
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

  // ── Step 5: Normal Addition & Grand Total ──
  const sequence: SequenceStep[] = [];
  let grandTotal = BigInt(0);

  for (let i = 0; i < n; i++) {
    const char = normalized[i];
    const originalIndex = i + 1;
    const step2Value = step2Vals[i];
    const indexSquared = squares[i].toString();
    const groupedValue = groupedValuesMap.get(char)!;
    // Step 5: Multiply Step 3 value (indexSquared) by Step 4 value (groupedValue)
    const additionResult = squares[i] * groupedValue;
    
    grandTotal += additionResult;

    sequence.push({
      char,
      originalIndex,
      step2Value: step2Value.toString(),
      indexSquared,
      groupedValue: groupedValue.toString(),
      additionResult: additionResult.toString(),
    });
  }

  // ── Step 6: Divide Grand Total by Number of Letters ──
  const letterCount = BigInt(n);
  const step6ExactStr = bigIntDivWithRounding(grandTotal, letterCount, 6);
  const step6Scientific = toScientificNotation(step6ExactStr);

  const reduction = reduceDigitsFromString(step6ExactStr);

  return {
    original: text,
    normalized,
    charAnalysis,
    sequence,
    grandTotal: grandTotal.toString(),
    step6Numerator: grandTotal.toString(),
    step6Denominator: n.toString(),
    step6ExactStr,
    step6Scientific,
    reductionSteps: reduction.steps,
    finalReduced: reduction.finalResult,
  };
}

// ─────────────────────────────────────────────────────────────
// BigInt exact division & Scientific Notation
// ─────────────────────────────────────────────────────────────

function bigIntDivWithRounding(numerator: bigint, denominator: bigint, precision: number = 6): string {
    const multiplier = BigInt(10) ** BigInt(precision);
    const extraMultiplier = BigInt(10) ** BigInt(precision + 1);
    
    let scaled = (numerator * extraMultiplier) / denominator;
    
    const lastDigit = scaled % BigInt(10);
    scaled = scaled / BigInt(10);
    
    // Always treat remainder as positive for rounding check
    let absLastDigit = lastDigit < BigInt(0) ? -lastDigit : lastDigit;
    if (absLastDigit >= BigInt(5)) {
        scaled += (scaled >= BigInt(0) ? BigInt(1) : BigInt(-1));
    }
    
    let scaledStr = scaled.toString();
    const isNeg = scaledStr.startsWith("-");
    if (isNeg) scaledStr = scaledStr.slice(1);
    
    if (scaledStr.length <= precision) {
        scaledStr = scaledStr.padStart(precision + 1, '0');
    }
    
    const intPart = scaledStr.slice(0, scaledStr.length - precision);
    let decPart = scaledStr.slice(scaledStr.length - precision);
    
    decPart = decPart.replace(/0+$/, '');
    
    const signStr = isNeg ? "-" : "";
    if (decPart.length > 0) {
        return `${signStr}${intPart}.${decPart}`;
    }
    return `${signStr}${intPart}`;
}

function toScientificNotation(decimalStr: string): string {
  const isNeg = decimalStr.startsWith("-");
  let s = isNeg ? decimalStr.slice(1) : decimalStr;
  
  const dotIdx = s.indexOf(".");
  let intPart = dotIdx >= 0 ? s.slice(0, dotIdx) : s;
  let fracPart = dotIdx >= 0 ? s.slice(dotIdx + 1) : "";
  
  const allDigits = intPart + fracPart;
  
  let firstNonZero = -1;
  for (let i = 0; i < allDigits.length; i++) {
      if (allDigits[i] !== "0") { firstNonZero = i; break; }
  }
  if (firstNonZero === -1) return "0";
  
  const significandDigits = allDigits.replace(/^0+/, "");
  let significand;
  if (significandDigits.length === 0) return "0";
  if (significandDigits.length === 1) {
      significand = significandDigits[0];
  } else {
      significand = significandDigits[0] + "." + significandDigits.slice(1);
      significand = significand.replace(/\.?0+$/, "");
  }
  
  const exp = intPart.replace(/^0+/, "").length > 0 
      ? intPart.replace(/^0+/, "").length - 1 
      : -(fracPart.length - significandDigits.length + 1);
  
  return (isNeg ? "-" : "") + significand + " × 10^" + exp;
}

function reduceDigitsFromString(decimalStr: string): { finalResult: string; steps: string[] } {
  const dotIdx = decimalStr.indexOf(".");
  let intStr = dotIdx >= 0 ? decimalStr.slice(0, dotIdx) : decimalStr;
  let decStr = dotIdx >= 0 ? decimalStr.slice(dotIdx + 1) : "";
  
  if (intStr.startsWith("-")) intStr = intStr.slice(1);
  
  const steps: string[] = [decimalStr];
  
  while (intStr.length > 1 || decStr.length > 1) {
      if (intStr.length > 1) {
          let sum = 0;
          for (const ch of intStr) { sum += Number(ch); }
          intStr = sum.toString();
      }
      if (decStr.length > 1) {
          let sum = 0;
          for (const ch of decStr) { sum += Number(ch); }
          decStr = sum.toString();
      }
      
      const combined = decStr.length > 0 ? `${intStr}.${decStr}` : intStr;
      steps.push(combined);
  }
  
  const finalResultStr = decStr.length > 0 ? `${intStr}.${decStr}` : intStr;
  return {
    finalResult: finalResultStr,
    steps
  };
}