// script.js - Advanced Numerology Calculator (Base-4)

// ---------- Step 1: Normalization ----------
function normalizeArabicText(text) {
  if (!text) return "";
  
  // Convert specific characters to "أ"
  let normalized = text.replace(/[اإآىءئؤ]/g, "أ");
  
  // Convert tied ta marbuta to open "ت"
  normalized = normalized.replace(/ة/g, "ت");
  
  // Note: "ه" is kept as it is.
  
  // Remove diacritics and spaces, keep only arabic letters
  normalized = normalized.replace(/[\u064B-\u065F\u0670\s]/g, ""); 
  normalized = normalized.replace(/[^أبتثجحخدذرزسشصضطظعغفقكلمنهوي]/g, "");
  
  return normalized;
}

// ---------- BigInt Exact Division to Decimal String ----------
// Divides numerator (BigInt) by denominator (BigInt) and returns
// a precise decimal string with up to `precision` decimal places,
// NO rounding — it simply stops at the specified number of digits.
function bigIntDivToExactString(numerator, denominator, precision) {
    const intPart = numerator / denominator;
    let remainder = numerator % denominator;
    
    if (remainder === 0n) {
        return intPart.toString();
    }
    
    let decimalStr = "";
    let digits = 0;
    while (remainder !== 0n && digits < precision) {
        remainder *= 10n;
        const digit = remainder / denominator;
        decimalStr += digit.toString();
        remainder = remainder % denominator;
        digits++;
    }
    
    return intPart.toString() + (decimalStr.length > 0 ? "." + decimalStr : "");
}

// ---------- Convert decimal string to Scientific Notation ----------
function toScientificNotation(decimalStr) {
    // Remove sign (handle positive only here)
    const isNeg = decimalStr.startsWith("-");
    let s = isNeg ? decimalStr.slice(1) : decimalStr;
    
    // Split into integer and decimal parts
    const dotIdx = s.indexOf(".");
    let intPart = dotIdx >= 0 ? s.slice(0, dotIdx) : s;
    let fracPart = dotIdx >= 0 ? s.slice(dotIdx + 1) : "";
    
    // Combine all digits
    const allDigits = intPart + fracPart;
    
    // Find first non-zero digit
    let firstNonZero = -1;
    for (let i = 0; i < allDigits.length; i++) {
        if (allDigits[i] !== "0") { firstNonZero = i; break; }
    }
    if (firstNonZero === -1) return "0";
    
    // Exponent = position of decimal point relative to first non-zero
    // Original decimal position: after intPart.length digits from left
    const exponent = intPart.length - 1 - firstNonZero + (intPart === "0" ? 0 : 0);
    
    // For numbers >= 1: exponent = intPart.length - 1
    // Significand = allDigits with decimal after first digit
    const significandDigits = allDigits.replace(/^0+/, ""); // remove leading zeros
    let significand;
    if (significandDigits.length === 0) return "0";
    if (significandDigits.length === 1) {
        significand = significandDigits[0];
    } else {
        significand = significandDigits[0] + "." + significandDigits.slice(1);
        // Trim trailing zeros in significand decimal part
        significand = significand.replace(/\.?0+$/, "");
    }
    
    // Compute exponent: number of digits in integer part - 1
    const exp = intPart.replace(/^0+/, "").length > 0 
        ? intPart.replace(/^0+/, "").length - 1 
        : -(fracPart.length - significandDigits.length + 1);
    
    return (isNeg ? "-" : "") + significand + " × 10<sup>" + exp + "</sup>";
}

// ---------- Final Reduction (Digital Root) from decimal string ----------
// Only uses the integer part's digits for summation (ignores decimal part)
function reduceDigitsFromString(decimalStr) {
    // Take integer part only
    const dotIdx = decimalStr.indexOf(".");
    let intStr = dotIdx >= 0 ? decimalStr.slice(0, dotIdx) : decimalStr;
    // Remove negative sign if any
    if (intStr.startsWith("-")) intStr = intStr.slice(1);
    
    // Digital root reduction
    while (intStr.length > 1) {
        let sum = 0;
        for (const ch of intStr) { sum += Number(ch); }
        intStr = sum.toString();
    }
    return Number(intStr);
}

// ---------- 6-Step Algorithm ----------
function computeSteps(rawText) {
    const cleaned = normalizeArabicText(rawText);
    const textLength = cleaned.length;
    
    const step1 = [];
    const step2 = [];
    const step3 = [];
    const charGroupedMap = {};
    
    // Process Steps 1, 2, 3, and grouping for Step 4
    for (let i = 0; i < textLength; i++) {
        const char = cleaned[i];
        
        // Step 1: 1-based index
        const index = BigInt(i + 1);
        step1.push({ char, index: i + 1 });
        
        // Step 2: Base-4 Multiplication
        const step2Value = index * 4n;
        step2.push({ char, value: step2Value });
        
        // Step 3: Squaring the values
        const step3Value = step2Value * step2Value;
        step3.push({ char, value: step3Value });
        
        // Step 4 Accumulation (Summing Step 3 values for identical letters)
        if (!charGroupedMap[char]) {
            charGroupedMap[char] = 0n;
        }
        charGroupedMap[char] += step3Value;
    }
    
    // Prepare Step 4 Data
    const step4 = [];
    for (const char in charGroupedMap) {
        step4.push({ char, total: charGroupedMap[char] });
    }
    
    // Step 5: Multiply Step 3 value × Step 4 grouped value for each character, then sum
    let grandTotal = 0n;
    const step5Details = [];
    
    for (let i = 0; i < textLength; i++) {
        const char = cleaned[i];
        // Step 3 value for this character
        const step3Value = step3[i].value;
        // Step 4: Grouped Value (sum of step3 for same letter)
        const groupedValue = charGroupedMap[char];
        
        // Step 5: Step3 × Step4
        const multiplicationResult = step3Value * groupedValue;
        
        // Accumulate to Grand Total
        grandTotal += multiplicationResult;
        
        step5Details.push({ 
            char, 
            step3Value,
            groupedValue, 
            multiplicationResult 
        });
    }

    // Step 6: Divide grand total by number of letters (NO rounding ever)
    const letterCount = BigInt(textLength);
    // Exact decimal string (no rounding, up to 50 decimal places)
    const step6ExactStr = bigIntDivToExactString(grandTotal, letterCount, 50);
    // Scientific notation display
    const step6Scientific = toScientificNotation(step6ExactStr);
    // Final digital root reduction ONLY after Step 6 division (on integer part)
    const finalDigit = reduceDigitsFromString(step6ExactStr);
    
    return {
        cleaned,
        textLength,
        step1,
        step2,
        step3,
        step4,
        step5: {
            details: step5Details,
            grandTotal
        },
        step6: {
            numerator: grandTotal,
            denominator: textLength,
            exactStr: step6ExactStr,
            scientific: step6Scientific,
            finalDigit
        }
    };
}

// ---------- UI Rendering ----------
function renderResults(result) {
    const resultsSection = document.getElementById("results");
    resultsSection.hidden = false;
    
    // Reset animations
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.style.animation = 'none';
        card.offsetHeight; /* trigger reflow */
        card.style.animation = null; 
    });
    
    // Render Step 1
    document.getElementById("step1Body").innerHTML = result.step1.map(r => 
        `<span class="badge">${r.char} <small style="margin-right: 5px; opacity: 0.7;">(${r.index})</small></span>`
    ).join('');
    
    // Render Step 2
    document.getElementById("step2Body").innerHTML = result.step2.map(r => 
        `<span class="badge" style="border-color: rgba(0, 206, 201, 0.4);"><span style="color: #fdcb6e; margin-left: 5px;">${r.char}</span> ${r.value}</span>`
    ).join('');
    
    // Render Step 3
    document.getElementById("step3Body").innerHTML = result.step3.map(r => 
        `<span class="badge" style="border-color: rgba(108, 92, 231, 0.4);"><span style="color: #fdcb6e; margin-left: 5px;">${r.char}</span> ${r.value}</span>`
    ).join('');
    
    // Render Step 4
    document.getElementById("step4Body").innerHTML = result.step4.map(r => 
        `<div class="grouped-item">
            <strong>${r.char}</strong>
            <span style="font-family: monospace; word-break: break-all;">${r.total}</span>
        </div>`
    ).join('');
    
    // Render Step 5 (Step3 × Step4 per character, then grand total)
    const step5Html = `
        <div class="step5-details">
            ${result.step5.details.map(r => 
                `<div class="multiplication-row">
                    <span class="char-label">${r.char}</span>
                    <span class="formula-part">خطوة٣: <strong>${r.step3Value}</strong></span>
                    <span class="times-symbol">×</span>
                    <span class="formula-part">خطوة٤: <strong>${r.groupedValue}</strong></span>
                    <span class="equals-symbol">=</span>
                    <span class="result-part">${r.multiplicationResult}</span>
                </div>`
            ).join('')}
        </div>
        <div class="grand-total">
            <h3>المجموع الكلي قبل الاختزال (GRAND TOTAL SUMMATION):</h3>
            <div class="big-number">${result.step5.grandTotal}</div>
        </div>
    `;
    document.getElementById("step5Body").innerHTML = step5Html;

    // Render Step 6 (Division by letter count + scientific + final digit)
    const step6Html = `
        <div class="step6-formula">
            <div class="division-display">
                <span class="div-label">${result.step6.numerator}</span>
                <span class="div-symbol">÷</span>
                <span class="div-label">${result.step6.denominator}</span>
                <span class="div-symbol">=</span>
                <span class="exact-result" style="font-family: monospace; direction: ltr; display: inline-block;">${result.step6.exactStr}</span>
            </div>
        </div>
        <div class="scientific-display">
            <h3>الصيغة العلمية (Scientific Notation):</h3>
            <div class="scientific-number">${result.step6.scientific}</div>
        </div>
        <div class="final-digit">
            <h3>الرقم النهائي المبوب (Digital Root):</h3>
            <div class="massive-number">${result.step6.finalDigit}</div>
        </div>
    `;
    document.getElementById("step6Body").innerHTML = step6Html;
}

// ---------- Event Listeners ----------
document.getElementById("calcBtn").addEventListener("click", () => {
    const input = document.getElementById("textInput").value;
    if (!input.trim()) {
        alert("الرجاء إدخال نص عربي للتحليل.");
        return;
    }
    
    // Execute Algorithm
    const result = computeSteps(input);
    
    if (result.cleaned.length === 0) {
        alert("لم يتم العثور على أحرف عربية صالحة بعد التنظيف. الرجاء إدخال نص صحيح.");
        return;
    }
    
    // Render
    renderResults(result);
});
