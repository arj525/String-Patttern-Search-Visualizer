# 🔍 String Pattern Search Visualizer

An **interactive learning tool** that demonstrates **Naive, Knuth-Morris-Pratt (KMP), and Rabin–Karp** string searching algorithms with **step-by-step animations**, **LPS table visualization**, **rolling hash comparisons**, and **performance analysis**.  

This project includes both a **web-based visualizer (HTML, CSS, JS)** and a **C++ backend implementation** for actual execution time and comparisons.

---

## 🚀 Features
- Input **custom text** and **pattern(s)** (multiple patterns supported, comma-separated)
- **Step-by-step animation** (1 second delay per comparison)
- **Naive algorithm** for baseline comparison
- **KMP** with **LPS table visualization**
- **Rabin–Karp** with **rolling hash + false positive detection**
- **Color-coded matches/mismatches**
- **Comparison count & execution time charts**
- **Dark Mode toggle 🌙**
- Export results as **.txt** or **.pdf**
- Responsive, modern **glassmorphism UI**

---

## 📂 Project Structure
```bash
.
├── index.html          # Web UI
├── style.css           # Styles (light/dark mode, glassmorphism)
├── script.js           # Visualization logic
├── kmp_rabin_karp.cpp  # C++ implementation (Naive, KMP, Rabin–Karp with timing)
└── README.md           # Project overview (this file)
