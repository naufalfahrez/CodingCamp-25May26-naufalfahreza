# Expense & Budget Visualizer — Project Steering

## Project Overview
A mobile-friendly web app to track daily spending. Built for the CodingCamp batch 25 May 2026.

## Technical Constraints
- **TC-1**: HTML + CSS + Vanilla JavaScript only (no frameworks)
- **TC-2**: Browser LocalStorage API for data persistence (client-side only)
- **TC-3**: Must work in Chrome, Firefox, Edge, Safari

## Folder Structure
```
/
├── index.html        # Main HTML structure
├── css/
│   └── style.css     # All styles (single CSS file)
├── js/
│   └── app.js        # All JavaScript logic (single JS file)
└── README.md
```

## Features Implemented
### MVP (Required)
- Input Form: Item Name, Amount, Category (Food, Transport, Fun), validation
- Transaction List: scrollable, shows name/amount/category, delete button
- Total Balance: displayed at top, auto-updates
- Pie Chart: spending by category using Chart.js, auto-updates

### Optional Challenges (3 of 5)
1. Dark/Light mode toggle
2. Sort transactions by amount or category
3. Highlight spending over a set limit

## Code Style
- Vanilla JS with clear section comments
- CSS variables for theming
- Mobile-first responsive design
- XSS protection via escapeHtml()
