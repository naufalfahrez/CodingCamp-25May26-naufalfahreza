# 💰 Expense & Budget Visualizer

A mobile-first web application to track daily spending, visualize expenses by category, and manage a personal budget — built with pure HTML, CSS, and Vanilla JavaScript.

> **CodingCamp Assignment** · Batch: 25 May 2026

---

## 🌐 Live Demo

> _[Link GitHub Pages akan diisi setelah deploy]_

---

## 📸 Preview

| Light Mode | Dark Mode |
|---|---|
| ![light](https://placehold.co/400x250?text=Light+Mode) | ![dark](https://placehold.co/400x250?text=Dark+Mode) |

---

## ✨ Features

### ⚡ Core (MVP)
| Feature | Description |
|---|---|
| **Input Form** | Add transactions with Item Name, Amount, and Category (Food, Transport, Fun, Other) |
| **Input Validation** | Blocks empty fields and rejects negative or zero amounts |
| **Transaction List** | Scrollable list showing name, amount, category, and timestamp |
| **Delete Transaction** | Remove any item instantly with live DOM update |
| **Total Balance** | Dynamically calculated using `.reduce()`, formatted as Rupiah |
| **Pie Chart** | Real-time spending distribution by category via Chart.js |
| **LocalStorage** | All data persists across page refreshes — no backend needed |

### 🎯 Optional Challenges (3/5 completed — all 5 implemented)
| Challenge | Status |
|---|---|
| 🌙 Dark / Light mode toggle | ✅ Done — preference saved to LocalStorage |
| 🔃 Sort transactions | ✅ Done — by Newest, Highest Amount, Lowest Amount |
| 🚨 Spending alert limit | ✅ Done — red border + red text when over limit |
| 📦 Custom categories | ✅ Done — "Other" category added |
| 📊 Category summary view | ✅ Done — progress bar breakdown below chart |

---

## 🗂️ Project Structure

```
CodingCamp-25May26-[name]/
├── index.html          # App structure & markup
├── css/
│   └── style.css       # All styles (CSS Variables, responsive, dark mode)
├── js/
│   └── app.js          # All logic (state, LocalStorage, Chart.js, events)
└── .kiro/              # Kiro AI workspace files
```

> ⚠️ Only **1 CSS file** and **1 JS file** — as required by the brief.

---

## 🛠️ Tech Stack

| Technology | Usage |
|---|---|
| **HTML5** | Semantic structure, accessibility attributes |
| **CSS3** | CSS Variables, Flexbox, Grid, responsive media queries |
| **Vanilla JavaScript** | State management, DOM manipulation, event handling |
| **Chart.js v4.4.0** | Pie chart with live `.update()` (no destroy/recreate) |
| **LocalStorage API** | Client-side data persistence |

---

## 🚀 Getting Started

No build tools or installations needed.

```bash
# Clone the repo
git clone https://github.com/[username]/CodingCamp-25May26-[name].git

# Open directly in browser
open index.html
```

Or just double-click `index.html` — it works as a standalone web page.

---

## 📐 How It Works

### State Management
All transactions are stored in a JavaScript array of objects:
```js
{
  id:       1716800000000,   // Date.now() timestamp — unique ID
  name:     "Makan siang",
  amount:   25000,           // float
  category: "Food"
}
```

### Data Flow
```
User Input → Validate → Push to state[] → saveToLocalStorage() → renderAll()
                                                                      ├── renderBalance()
                                                                      ├── renderTransactions()
                                                                      ├── updateChart()
                                                                      └── renderSummary()
```

### Chart Updates
Chart.js is initialized **once** on page load. Data is updated by mutating `chart.data` directly and calling `chart.update()` — the canvas element is never destroyed.

---

## 🎨 UI Highlights

- **Card-based layout** — clean, minimal, shadcn-inspired
- **CSS Variables** — single source of truth for all colors, easy theme switching
- **Mobile-first** — 1-column on phones, 2-column grid on desktop (≥768px)
- **Spending alert** — transactions exceeding the set limit get a red left border and red amount text
- **Smooth animations** — slide-in on new transactions, animated chart renders

---

## 📋 Constraints Met

| Constraint | Met? |
|---|---|
| TC-1: HTML + CSS + Vanilla JS only | ✅ |
| TC-1: No frameworks (React, Vue, etc.) | ✅ |
| TC-2: Browser LocalStorage, client-side only | ✅ |
| TC-3: Works on Chrome, Firefox, Edge, Safari | ✅ |
| Folder: Only 1 CSS file in `css/` | ✅ |
| Folder: Only 1 JS file in `js/` | ✅ |

---

## 📦 Deployment

This project is deployed via **GitHub Pages**:

1. Push code to `main` branch
2. Go to **Settings → Pages**
3. Set source to `main` branch, root `/`
4. GitHub Pages URL will be generated automatically

---

## 👤 Author

**[Your Name]**
CodingCamp · Batch 25 May 2026
