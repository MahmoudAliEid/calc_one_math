/**
 * Reduction utilities for the Arabic Jafr numerical calculation.
 * Provides digit-sum reduction for both regular numbers and BigInt.
 */

export interface ReductionResult {
  finalResult: number;
  steps: string[]; // Intermediate strings showing the process
}

/**
 * Digital root for BigInt values.
 * Repeatedly sums all digits until result is a single digit (1-9).
 *
 * @param val - The BigInt (or string representation) to reduce
 * @returns The single-digit result and intermediate steps
 */
export function digitalRoot(val: bigint | string): ReductionResult {
  let currentValStr = typeof val === 'bigint' ? val.toString() : val;
  const steps: string[] = [currentValStr];

  while (currentValStr.length > 1) {
    // Sum all digits together
    const sum = currentValStr.split('').reduce((acc, digit) => {
      return acc + BigInt(digit);
    }, BigInt(0));

    currentValStr = sum.toString();
    steps.push(currentValStr);
  }

  return {
    finalResult: parseInt(currentValStr, 10),
    steps,
  };
}

/**
 * Reduce a regular number to a single digit (1-9) by repeatedly
 * summing its digits. Used for Step 2 (position sum simplification).
 *
 * @param num - The number to reduce
 * @returns Single digit 1-9 (or 0 if input is 0)
 */
export function reduceToDigit(num: number): number {
  while (num > 9) {
    num = num
      .toString()
      .split('')
      .reduce((sum, digit) => sum + parseInt(digit, 10), 0);
  }
  return num;
}

/**
 * Reduce a regular number to a single digit, returning all intermediate steps.
 *
 * @param num - The number to reduce
 * @returns The final digit and all intermediate values
 */
export function reduceToDigitWithSteps(num: number): { result: number; steps: number[] } {
  const steps: number[] = [num];
  let current = num;
  while (current > 9) {
    current = current
      .toString()
      .split('')
      .reduce((sum, digit) => sum + parseInt(digit, 10), 0);
    steps.push(current);
  }
  return { result: current, steps };
}
