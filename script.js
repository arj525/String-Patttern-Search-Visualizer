// function highlight(text, pattern, start, matched) {
//     let result = '';
//     for (let i = 0; i < text.length; i++) {
//       if (i >= start && i < start + pattern.length) {
//         result += `<span class="${matched ? 'match' : 'mismatch'}">${text[i]}</span>`;
//       } else {
//         result += text[i];
//       }
//     }
//     return result;
//   }
  
//   function runKMP() {
//     const text = document.getElementById("text").value;
//     const pattern = document.getElementById("pattern").value;
//     const output = document.getElementById("kmp-output");
  
//     if (!text || !pattern) {
//       output.innerHTML = "❌ Please enter both text and pattern.";
//       return;
//     }
  
//     const lps = Array(pattern.length).fill(0);
//     let len = 0, i = 1;
//     while (i < pattern.length) {
//       if (pattern[i] === pattern[len]) {
//         lps[i++] = ++len;
//       } else if (len !== 0) {
//         len = lps[len - 1];
//       } else {
//         lps[i++] = 0;
//       }
//     }
  
//     let res = `LPS Array: [${lps.join(', ')}]\n\n`;
//     i = 0; let j = 0;
//     while (i < text.length) {
//       res += `Comparing "${text[i]}" with "${pattern[j]}"\n`;
//       if (pattern[j] === text[i]) {
//         i++; j++;
//       }
  
//       if (j === pattern.length) {
//         res += `✅ Match found at index ${i - j}\n\n`;
//         res += highlight(text, pattern, i - j, true) + '\n\n';
//         j = lps[j - 1];
//       } else if (i < text.length && pattern[j] !== text[i]) {
//         res += `❌ Mismatch\n`;
//         res += highlight(text, pattern, i - j, false) + '\n\n';
//         j = j !== 0 ? lps[j - 1] : 0;
//         if (j === 0) i++;
//       }
//     }
  
//     output.innerHTML = res;
//   }
  
//   function runRabinKarp() {
//     const text = document.getElementById("text").value;
//     const pattern = document.getElementById("pattern").value;
//     const output = document.getElementById("rk-output");
  
//     if (!text || !pattern) {
//       output.innerHTML = "❌ Please enter both text and pattern.";
//       return;
//     }
  
//     const d = 256;
//     const q = 101;
//     const M = pattern.length;
//     const N = text.length;
//     let p = 0, t = 0, h = 1;
//     let result = "";
  
//     for (let i = 0; i < M - 1; i++) h = (h * d) % q;
//     for (let i = 0; i < M; i++) {
//       p = (d * p + pattern.charCodeAt(i)) % q;
//       t = (d * t + text.charCodeAt(i)) % q;
//     }
  
//     for (let i = 0; i <= N - M; i++) {
//       result += `Hash Compare at ${i}: ${p} vs ${t}\n`;
  
//       if (p === t) {
//         let match = true;
//         for (let j = 0; j < M; j++) {
//           if (text[i + j] !== pattern[j]) {
//             match = false;
//             break;
//           }
//         }
//         if (match) {
//           result += `✅ Match found at index ${i}\n`;
//           result += highlight(text, pattern, i, true) + '\n\n';
//         } else {
//           result += `⚠️ False positive at index ${i}\n`;
//           result += highlight(text, pattern, i, false) + '\n\n';
//         }
//       }
  
//       if (i < N - M) {
//         t = (d * (t - text.charCodeAt(i) * h) + text.charCodeAt(i + M)) % q;
//         if (t < 0) t = t + q;
//       }
//     }
  
//     output.innerHTML = result;
//   }
  
//   function clearOutput() {
//     document.getElementById("kmp-output").innerText = "⏳ Waiting for input...";
//     document.getElementById("rk-output").innerText = "⏳ Waiting for input...";
//   }







// ======= Utilities =======
const $ = (id) => document.getElementById(id);

const highlight = (text, pattern, start, matched) => {
  let out = "";
  for (let i = 0; i < text.length; i++) {
    if (i >= start && i < start + pattern.length) {
      out += `<span class="${matched ? "match" : "mismatch"}">${text[i]}</span>`;
    } else out += text[i];
  }
  return out;
};

const animateSteps = async (lines, outEl, doAnimate = true, delay = 1000) => {
  outEl.innerHTML = "";
  for (const line of lines) {
    outEl.innerHTML += line + "\n";
    if (doAnimate) await new Promise((r) => setTimeout(r, delay));
  }
};

const toPatterns = (raw) =>
  raw.split(",").map((s) => s.trim()).filter(Boolean);

const nowMs = () => performance.now();

// Export helpers
const downloadText = (filename, text) => {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
};

const exportPDF = (filename, contentMap) => {
  const { jsPDF } = window.jspdf || {};
  if (!jsPDF) {
    alert("PDF library not loaded. Try again with internet or export TXT instead.");
    return;
  }
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const margin = 40;
  let y = margin;

  const addLine = (text, bold = false) => {
    const lineHeight = 14;
    if (bold) doc.setFont(undefined, "bold"); else doc.setFont(undefined, "normal");
    const split = doc.splitTextToSize(text, 515);
    split.forEach((t) => {
      if (y > 770) { doc.addPage(); y = margin; }
      doc.text(t, margin, y);
      y += lineHeight;
    });
    y += 4;
  };

  addLine("String Pattern Search Visualizer — Report", true);
  addLine(new Date().toString());
  addLine("");

  for (const [title, text] of Object.entries(contentMap)) {
    addLine(title, true);
    addLine(text || "(no output)");
    addLine("");
  }

  doc.save(filename);
};

// ======= Theme =======
const applyTheme = () => {
  const dark = localStorage.getItem("theme") === "dark";
  document.body.classList.toggle("dark", dark);
  $("theme-toggle").checked = dark;
};

$("theme-toggle").addEventListener("change", (e) => {
  localStorage.setItem("theme", e.target.checked ? "dark" : "light");
  applyTheme();
});
applyTheme();

// ======= LPS =======
const buildLPS = (pat) => {
  const lps = Array(pat.length).fill(0);
  let len = 0, i = 1;
  while (i < pat.length) {
    if (pat[i] === pat[len]) lps[i++] = ++len;
    else if (len !== 0) len = lps[len - 1];
    else lps[i++] = 0;
  }
  return lps;
};

const renderLPSTable = (pat, lps) => {
  const thead = $("lps-table").querySelector("thead");
  const tbody = $("lps-table").querySelector("tbody");
  if (!pat || !lps?.length) { thead.innerHTML = ""; tbody.innerHTML = ""; return; }

  const head1 = ["", ...pat.split("")].map((c) => `<th>${c}</th>`).join("");
  const row2 = ["LPS", ...lps.map((n) => `<td>${n}</td>`)].join("");
  thead.innerHTML = `<tr>${head1}</tr>`;
  tbody.innerHTML = `<tr>${row2}</tr>`;
};

// ======= Naive =======
const runNaiveSingle = (text, pat) => {
  const steps = [];
  let comps = 0;
  const t0 = nowMs();

  for (let i = 0; i <= text.length - pat.length; i++) {
    steps.push(`Window @ ${i}`);
    let matched = true;
    for (let j = 0; j < pat.length; j++) {
      comps++;
      steps.push(`  compare text[${i + j}]="${text[i + j]}" vs pat[${j}]="${pat[j]}"`);
      if (text[i + j] !== pat[j]) { matched = false; break; }
    }
    if (matched) {
      steps.push(`✅ Match at index ${i}`);
      steps.push(highlight(text, pat, i, true));
    } else {
      steps.push(`❌ Mismatch at index ${i}`);
      steps.push(highlight(text, pat, i, false));
    }
    steps.push("");
  }
  const t1 = nowMs();
  return { steps, comps, time: (t1 - t0) };
};

// ======= KMP =======
const runKMPSingle = (text, pat) => {
  const steps = [];
  let comps = 0;
  const t0 = nowMs();
  const lps = buildLPS(pat);
  steps.push(`LPS: [${lps.join(", ")}]`, "");

  let i = 0, j = 0;
  while (i < text.length) {
    steps.push(`Compare text[${i}]="${text[i]}" vs pat[${j}]="${pat[j]}"`);
    comps++;
    if (text[i] === pat[j]) { i++; j++; }
    if (j === pat.length) {
      const idx = i - j;
      steps.push(`✅ Match at index ${idx}`);
      steps.push(highlight(text, pat, idx, true), "");
      j = lps[j - 1];
    } else if (i < text.length && text[i] !== pat[j]) {
      steps.push(`❌ Mismatch, shift using LPS (j from ${j} to ${j ? lps[j - 1] : 0})`);
      steps.push(highlight(text, pat, i - j, false), "");
      j = j ? lps[j - 1] : 0;
      if (j === 0) i++;
    }
  }
  const t1 = nowMs();
  return { steps, comps, time: (t1 - t0), lps };
};

// ======= Rabin–Karp =======
const runRKSingle = (text, pat, d = 256, q = 101) => {
  const steps = [];
  let comps = 0;
  const t0 = nowMs();

  const M = pat.length, N = text.length;
  let p = 0, t = 0, h = 1;

  for (let i = 0; i < M - 1; i++) h = (h * d) % q;
  for (let i = 0; i < M; i++) {
    p = (d * p + pat.charCodeAt(i)) % q;
    t = (d * t + text.charCodeAt(i)) % q;
  }

  for (let i = 0; i <= N - M; i++) {
    steps.push(`Hash @${i}: pattern=${p}, window=${t}`);
    if (p === t) {
      let match = true;
      for (let j = 0; j < M; j++) {
        comps++;
        if (text[i + j] !== pat[j]) { match = false; break; }
      }
      if (match) {
        steps.push(`✅ Match at index ${i}`);
        steps.push(highlight(text, pat, i, true), "");
      } else {
        steps.push(`⚠️ False positive @${i}`);
        steps.push(highlight(text, pat, i, false), "");
      }
    }
    if (i < N - M) {
      t = (d * (t - text.charCodeAt(i) * h) + text.charCodeAt(i + M)) % q;
      if (t < 0) t += q;
    }
  }

  const t1 = nowMs();
  return { steps, comps, time: (t1 - t0) };
};

// ======= Charts =======
let cmpChart, timeChart;
const initCharts = () => {
  const cmpCtx = $("cmpChart").getContext("2d");
  const timeCtx = $("timeChart").getContext("2d");

  cmpChart = new Chart(cmpCtx, {
    type: "bar",
    data: {
      labels: ["Naive", "KMP", "Rabin–Karp"],
      datasets: [{ label: "Comparisons", data: [0, 0, 0] }]
    },
    options: { responsive: true, plugins: { legend: { display: false } } }
  });

  timeChart = new Chart(timeCtx, {
    type: "bar",
    data: {
      labels: ["Naive", "KMP", "Rabin–Karp"],
      datasets: [{ label: "Time (ms)", data: [0, 0, 0] }]
    },
    options: { responsive: true, plugins: { legend: { display: false } } }
  });
};

const updateCharts = (naive, kmp, rk) => {
  cmpChart.data.datasets[0].data = [naive.comps, kmp.comps, rk.comps];
  timeChart.data.datasets[0].data = [
    +naive.time.toFixed(3),
    +kmp.time.toFixed(3),
    +rk.time.toFixed(3),
  ];
  cmpChart.update();
  timeChart.update();
};

// ======= Orchestrators =======
const visualizeAlgo = async (algo, outEl, text, patterns, { animate }) => {
  let combined = "";
  let totalComps = 0;
  let totalTime = 0;
  let lastLPS = null;

  for (const pat of patterns) {
    if (!pat || !text || pat.length > text.length) {
      combined += `⚠️ Skipping pattern "${pat}" (invalid/longer than text)\n\n`;
      continue;
    }
    const res = algo(text, pat);
    totalComps += res.comps;
    totalTime += res.time;
    if (res.lps) lastLPS = { pat, lps: res.lps };

    combined += `Pattern: "${pat}"\n`;
    combined += `Comparisons: ${res.comps}\n`;
    combined += `Time: ${res.time.toFixed(3)} ms\n\n`;

    await animateSteps(res.steps, outEl, animate);
    combined += outEl.innerText + "\n\n";
  }

  if (lastLPS) renderLPSTable(lastLPS.pat, lastLPS.lps);
  else renderLPSTable("", []);

  return { comps: totalComps, time: totalTime, text: combined.trim() };
};

const getInputs = () => {
  const text = $("text").value;
  const patterns = toPatterns($("patterns").value);
  const animate = $("animate-toggle").checked;
  return { text, patterns, animate };
};

// ======= Buttons =======
$("btn-clear").addEventListener("click", () => {
  $("naive-output").innerText = "⏳ Waiting for input...";
  $("kmp-output").innerText = "⏳ Waiting for input...";
  $("rk-output").innerText = "⏳ Waiting for input...";
  renderLPSTable("", []);
  updateCharts({ comps: 0, time: 0 }, { comps: 0, time: 0 }, { comps: 0, time: 0 });
});

$("btn-naive").addEventListener("click", async () => {
  const { text, patterns, animate } = getInputs();
  if (!text || !patterns.length) return alert("Please enter text and pattern(s).");

  const naive = await visualizeAlgo(runNaiveSingle, $("naive-output"), text, patterns, { animate });
  // keep charts untouched here
});

$("btn-kmp").addEventListener("click", async () => {
  const { text, patterns, animate } = getInputs();
  if (!text || !patterns.length) return alert("Please enter text and pattern(s).");

  const kmp = await visualizeAlgo(runKMPSingle, $("kmp-output"), text, patterns, { animate });
  // charts untouched
});

$("btn-rk").addEventListener("click", async () => {
  const { text, patterns, animate } = getInputs();
  if (!text || !patterns.length) return alert("Please enter text and pattern(s).");

  const rk = await visualizeAlgo(runRKSingle, $("rk-output"), text, patterns, { animate });
  // charts untouched
});

$("btn-runall").addEventListener("click", async () => {
  const { text, patterns, animate } = getInputs();
  if (!text || !patterns.length) return alert("Please enter text and pattern(s).");

  const naive = await visualizeAlgo(runNaiveSingle, $("naive-output"), text, patterns, { animate });
  const kmp = await visualizeAlgo(runKMPSingle, $("kmp-output"), text, patterns, { animate });
  const rk  = await visualizeAlgo(runRKSingle,  $("rk-output"), text, patterns, { animate });

  updateCharts(naive, kmp, rk);
});

$("btn-export").addEventListener("click", () => {
  const txt =
`=== String Pattern Search Visualizer Report ===
Date: ${new Date().toString()}

--- Inputs ---
Text:
${$("text").value}

Patterns:
${$("patterns").value}

--- Naive Output ---
${$("naive-output").innerText}

--- KMP Output ---
${$("kmp-output").innerText}

--- Rabin–Karp Output ---
${$("rk-output").innerText}
`;
  downloadText("string-visualizer-report.txt", txt);
});

$("btn-export-pdf").addEventListener("click", () => {
  const content = {
    "Inputs — Text": $("text").value,
    "Inputs — Patterns": $("patterns").value,
    "Naive Output": $("naive-output").innerText,
    "KMP Output": $("kmp-output").innerText,
    "Rabin–Karp Output": $("rk-output").innerText,
  };
  exportPDF("string-visualizer-report.pdf", content);
});

// ======= Init =======
initCharts();
