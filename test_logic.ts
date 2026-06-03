import { calculateArabicPower } from './src/lib/calculate';

const tests = [
    { text: "جيل جميل", expected: 3 },
    { text: "محمد و محمود", expected: 9 },
    { text: "نور ونوره", expected: 1 },
    { text: "جار جلال", expected: 7 },
    { text: "محمود", expected: 5 },
];

tests.forEach(({ text, expected }) => {
    try {
        const result = calculateArabicPower(text);
        console.log(`Input: ${text}`);
        console.log(`Normalized: ${result.normalized}`);
        console.log(`Step 1 to 4: Char Analysis:`);
        result.charAnalysis.forEach(a => {
            console.log(`  Char: ${a.char}`);
            console.log(`    Positions (Step 1): [${a.positions.join(', ')}]`);
            console.log(`    Squares (Step 3):   [${a.squares.join(', ')}]`);
            console.log(`    Grouped Sum (Step 4): ${a.groupedValue}`);
        });
        console.log(`Step 5: Sequence:`);
        result.sequence.forEach(s => {
            console.log(`  Char ${s.char} at index ${s.originalIndex} -> Value: ${s.additionResult}`);
        });
        console.log(`Grand Total: ${result.grandTotal}`);
        console.log(`Reduction: ${result.reductionSteps.join(' → ')}`);
        console.log(`Final Result: ${result.finalReduced}${expected !== null ? ` (Expected: ${expected})` : ''}`);
        console.log('---');
    } catch (e) {
        console.error(`Error for ${text}:`, e);
    }
});

