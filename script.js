// script.js - Advanced Numerology Calculator (Base-16)

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

// ---------- Final Reduction ----------
function reduceToSingleDigit(numBigInt) {
    let str = numBigInt.toString();
    while (str.length > 1) {
        let sum = 0n;
        for (let ch of str) {
            sum += BigInt(ch);
        }
        str = sum.toString();
    }
    return Number(str);
}

// ---------- 5-Step Algorithm ----------
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
        
        // Step 2: Base-16 Multiplication
        const step2Value = index * 16n;
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
    
    // Step 5: Cross-Multiplication, Grand Total Sum, and Final Reduction
    let grandTotal = 0n;
    const step5Details = [];
    
    for (let i = 0; i < textLength; i++) {
        const char = cleaned[i];
        // Value from Step 2
        const step2Value = BigInt(i + 1) * 16n;
        // Grouped Value from Step 4
        const groupedValue = charGroupedMap[char];
        
        // Cross-Multiplication
        const currentMultiplication = step2Value * groupedValue; 
        
        // Accumulate to Grand Total
        grandTotal += currentMultiplication;
        
        step5Details.push({ 
            char, 
            step2Value, 
            groupedValue, 
            currentMultiplication 
        });
    }
    
    // Final Digital Root Reduction (ONLY after Grand Total is fully computed)
    const finalDigit = reduceToSingleDigit(grandTotal);
    
    return {
        cleaned,
        step1,
        step2,
        step3,
        step4,
        step5: {
            details: step5Details,
            grandTotal,
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
    
    // Render Step 5
    const step5Html = `
        <div class="step5-details">
            ${result.step5.details.map(r => 
                `<div class="multiplication-row">
                    <span>${r.char}:</span> 
                    <span>${r.step2Value} × ${r.groupedValue}</span> 
                    <span>= ${r.currentMultiplication}</span>
                </div>`
            ).join('')}
        </div>
        <div class="grand-total">
            <h3>المجموع الكلي للضرب التبادلي:</h3>
            <div class="big-number">${result.step5.grandTotal}</div>
        </div>
        <div class="final-digit">
            <h3>الرقم النهائي المرجّع (1-9):</h3>
            <div class="massive-number">${result.step5.finalDigit}</div>
        </div>
    `;
    document.getElementById("step5Body").innerHTML = step5Html;
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
