import { calculateArabicPower } from './src/lib/calculate';

const tests = [
    { text: "جيل جميل", expected: 3 },
    { text: "محمد و محمود", expected: 3 },
    { text: "نور ونوره", expected: null },
    { text: "جار جلال", expected: null },
];

tests.forEach(({ text, expected }) => {
    try {
        const result = calculateArabicPower(text);
        console.log(`Input: ${text}`);
        console.log(`Normalized: ${result.normalized}`);
        console.log(`Step 1 & 2 & 3: Char Analysis:`);
        result.charAnalysis.forEach(a => {
            console.log(`  Char: ${a.char}`);
            console.log(`    Positions (Step 1): [${a.positions.join(', ')}]`);
            console.log(`    Squares (Step 2):   [${a.squares.join(', ')}]`);
            console.log(`    Grouped Sum (Step 3): ${a.groupedValue}`);
        });
        console.log(`Step 4: Sequence:`);
        result.sequence.forEach(s => {
            console.log(`  Char ${s.char} at index ${s.originalIndex} -> ${s.originalIndex} * ${s.groupedValue} = ${s.multiplicationResult}`);
        });
        console.log(`Grand Total: ${result.grandTotal}`);
        console.log(`Reduction: ${result.reductionSteps.join(' → ')}`);
        console.log(`Final Result: ${result.finalReduced}${expected !== null ? ` (Expected: ${expected})` : ''}`);
        console.log('---');
    } catch (e) {
        console.error(`Error for ${text}:`, e);
    }
});

