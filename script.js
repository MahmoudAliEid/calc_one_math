// script.js – Arabic Gematria Calculator (Multiplier 4)
// Author: Auto‑generated

// ---------- Normalization ----------
function normalizeArabicText(text) {
  if (!text) return "";
  // Convert various forms of alif and hamza to "أ"
  let normalized = text.replace(/[اإآىءئؤ]/g, "أ");
  // Convert tied ta marbuta to "ت"
  normalized = normalized.replace(/ة/g, "ت");
  // Remove spaces, punctuation, numbers, and any non‑Arabic letters
  normalized = normalized.replace(/[^أبتثجحخدذرزسشصضطظعغفقكلمنهوي]/g, "");
  return normalized;
}

// ---------- Digit Sum (final reduction) ----------
function digitSumBigInt(bi) {
  let str = bi.toString();
  while (str.length > 1) {
    let sum = 0n;
    for (let ch of str) {
      sum += BigInt(ch);
    }
    str = sum.toString();
  }
  return Number(str);
}

// ---------- Compute Steps ----------
function computeSteps(rawText) {
  const cleaned = normalizeArabicText(rawText);
  const step1 = [];
  const step2 = [];
  const aggMap = new Map(); // char -> aggregated BigInt

  for (let i = 0; i < cleaned.length; i++) {
    const char = cleaned[i];
    const idx = BigInt(i + 1);
    const value = idx * 4n; // step 2
    step1.push({ char, index: i + 1 });
    step2.push({ char, index: i + 1, value });
    const prev = aggMap.get(char) || 0n;
    aggMap.set(char, prev + value);
  }

  // Step 4 – replacement values preserving original order
  const replacedValues = [];
  for (let i = 0; i < cleaned.length; i++) {
    const char = cleaned[i];
    const agg = aggMap.get(char);
    replacedValues.push({ char, value: agg });
  }

  // Grand total
  let grandTotal = 0n;
  for (const { value } of replacedValues) {
    grandTotal += value;
  }

  const finalDigit = digitSumBigInt(grandTotal);

  return {
    step1,
    step2,
    step3: Array.from(aggMap.entries()).map(([char, total]) => ({ char, total })),
    step4: {
      replacedValues,
      grandTotal,
      finalDigit,
    },
  };
}

// ---------- UI Rendering ----------
function clearResults() {
  document.getElementById("step1Body").innerHTML = "";
  document.getElementById("step2Body").innerHTML = "";
  document.getElementById("step3Body").innerHTML = "";
  document.getElementById("step4Body").innerHTML = "";
}

function renderTable(containerId, rows, columns) {
  const table = document.createElement("table");
  table.className = "result-table";
  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");
  for (const col of columns) {
    const th = document.createElement("th");
    th.textContent = col;
    headerRow.appendChild(th);
  }
  thead.appendChild(headerRow);
  table.appendChild(thead);

  const tbody = document.createElement("tbody");
  for (const row of rows) {
    const tr = document.createElement("tr");
    for (const col of columns) {
      const td = document.createElement("td");
      td.textContent = row[col];
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  }
  table.appendChild(ttbody);
  document.getElementById(containerId).appendChild(table);
}

function renderStep4(containerId, data) {
  const div = document.createElement("div");
  const ul = document.createElement("ul");
  for (const { char, value } of data.replacedValues) {
    const li = document.createElement("li");
    li.textContent = `${char}: ${value.toString()}`;
    ul.appendChild(li);
  }
  const totalP = document.createElement("p");
  totalP.textContent = `Grand Total: ${data.grandTotal.toString()}`;
  const finalP = document.createElement("p");
  finalP.textContent = `Final Digit (1‑9): ${data.finalDigit}`;
  div.appendChild(ul);
  div.appendChild(totalP);
  div.appendChild(finalP);
  document.getElementById(containerId).appendChild(div);
}

document.getElementById("calcBtn").addEventListener("click", () => {
  const input = document.getElementById("textInput").value;
  clearResults();
  if (!input.trim()) {
    alert("Please enter Arabic text.");
    return;
  }
  const result = computeSteps(input);
  // Step 1 table
  renderTable("step1Body", result.step1, ["char", "index"]);
  // Step 2 table
  const step2Rows = result.step2.map(r => ({ char: r.char, index: r.index, value: r.value.toString() }));
  renderTable("step2Body", step2Rows, ["char", "index", "value"]);
  // Step 3 aggregation table
  const step3Rows = result.step3.map(r => ({ char: r.char, total: r.total.toString() }));
  renderTable("step3Body", step3Rows, ["char", "total"]);
  // Step 4 results
  renderStep4("step4Body", result.step4);
});

// Optional: add copy‑to‑clipboard for each step (future enhancement)
