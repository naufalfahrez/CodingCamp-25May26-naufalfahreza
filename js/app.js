/**
 * Expense & Budget Visualizer — app.js
 * Vanilla JS | State Management | LocalStorage | Chart.js
 */

// ============================================================
// 1. STATE & CONSTANTS
// ============================================================

/** Emoji map per kategori */
const CATEGORY_ICONS = {
  Food:      '🍔',
  Transport: '🚗',
  Fun:       '🎮',
  Other:     '📦',
};

/** Warna chart per kategori */
const CATEGORY_COLORS = {
  Food:      '#6366f1',
  Transport: '#f59e0b',
  Fun:       '#22c55e',
  Other:     '#94a3b8',
};

/** State utama aplikasi */
let transactions = [];
let spendingLimit = 0;
let sortOrder    = 'newest';
let expenseChart = null;

// ============================================================
// 2. LOCAL STORAGE HELPERS
// ============================================================

/** Muat semua data dari LocalStorage ke state */
function loadFromStorage() {
  const stored = localStorage.getItem('ebv_transactions');
  transactions  = stored ? JSON.parse(stored) : [];

  const limit = localStorage.getItem('ebv_limit');
  spendingLimit = limit ? parseFloat(limit) : 0;

  const theme = localStorage.getItem('ebv_theme') || 'light';
  document.documentElement.setAttribute('data-theme', theme);
  document.getElementById('themeIcon').textContent = theme === 'dark' ? '☀️' : '🌙';
}

/** Simpan array transaksi ke LocalStorage */
function saveTransactions() {
  localStorage.setItem('ebv_transactions', JSON.stringify(transactions));
}

/** Simpan spending limit ke LocalStorage */
function saveLimit() {
  localStorage.setItem('ebv_limit', spendingLimit.toString());
}

// ============================================================
// 3. FORMAT HELPERS
// ============================================================

/**
 * Format angka ke format Rupiah.
 * @param {number} amount
 * @returns {string} misal "Rp 150.000"
 */
function formatRupiah(amount) {
  return 'Rp ' + amount.toLocaleString('id-ID', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

/**
 * Format timestamp ke string tanggal & waktu singkat.
 * @param {number} ts - Unix timestamp (ms)
 * @returns {string}
 */
function formatDate(ts) {
  return new Date(ts).toLocaleString('id-ID', {
    day:    '2-digit',
    month:  'short',
    year:   'numeric',
    hour:   '2-digit',
    minute: '2-digit',
  });
}

// ============================================================
// 4. SORTING
// ============================================================

/**
 * Kembalikan salinan array transaksi yang sudah diurutkan
 * sesuai sortOrder saat ini.
 * @returns {Array}
 */
function getSortedTransactions() {
  const copy = [...transactions];
  if (sortOrder === 'newest') {
    copy.sort((a, b) => b.id - a.id);
  } else if (sortOrder === 'highest') {
    copy.sort((a, b) => b.amount - a.amount);
  } else if (sortOrder === 'lowest') {
    copy.sort((a, b) => a.amount - b.amount);
  }
  return copy;
}

// ============================================================
// 5. RENDER — BALANCE
// ============================================================

/**
 * Hitung total pengeluaran dengan .reduce() dan perbarui DOM.
 */
function renderBalance() {
  const total = transactions.reduce((acc, tx) => acc + tx.amount, 0);
  document.getElementById('totalBalance').textContent = formatRupiah(total);
  document.getElementById('txCount').textContent =
    `${transactions.length} transaksi tercatat`;
}

// ============================================================
// 6. RENDER — TRANSACTION LIST
// ============================================================

/**
 * Render ulang seluruh daftar transaksi ke DOM.
 * Menerapkan kelas 'over-limit' jika nominal melebihi spendingLimit.
 * Menggunakan innerHTML agar emptyState tidak hilang dari DOM.
 */
function renderTransactions() {
  const list   = document.getElementById('txList');
  const sorted = getSortedTransactions();

  if (sorted.length === 0) {
    list.innerHTML = '<li class="tx-empty">Belum ada transaksi. Tambahkan yang pertama!</li>';
    return;
  }

  list.innerHTML = sorted.map(tx => {
    const isOverLimit = spendingLimit > 0 && tx.amount > spendingLimit;
    const icon        = CATEGORY_ICONS[tx.category] || '📦';
    return `
      <li class="tx-item${isOverLimit ? ' over-limit' : ''}" data-id="${tx.id}">
        <div class="tx-icon">${icon}</div>
        <div class="tx-info">
          <p class="tx-name">${escapeHtml(tx.name)}</p>
          <p class="tx-meta">${escapeHtml(tx.category)} · ${formatDate(tx.id)}</p>
        </div>
        <div class="tx-right">
          <span class="tx-amount">${formatRupiah(tx.amount)}</span>
          <button class="btn-delete" data-id="${tx.id}" aria-label="Hapus transaksi ${escapeHtml(tx.name)}">✕</button>
        </div>
      </li>`;
  }).join('');
}

// ============================================================
// 7. RENDER — CHART
// ============================================================

/**
 * Hitung akumulasi pengeluaran per kategori dari state.
 * @returns {{ labels: string[], data: number[], colors: string[] }}
 */
function getChartData() {
  const totals = {};
  transactions.forEach(tx => {
    totals[tx.category] = (totals[tx.category] || 0) + tx.amount;
  });

  const labels = Object.keys(totals);
  const data   = labels.map(l => totals[l]);
  const colors = labels.map(l => CATEGORY_COLORS[l] || '#94a3b8');

  return { labels, data, colors };
}

/**
 * Ambil warna teks dari CSS variable --text-secondary.
 * Fallback ke '#64748b' jika belum ter-resolve.
 * @returns {string}
 */
function getLegendColor() {
  const val = getComputedStyle(document.documentElement)
                .getPropertyValue('--text-secondary').trim();
  return val || '#64748b';
}

/**
 * Inisialisasi Chart.js Pie Chart (dipanggil sekali saat load).
 */
function initChart() {
  const ctx = document.getElementById('expenseChart').getContext('2d');
  const { labels, data, colors } = getChartData();

  expenseChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: colors,
        borderColor:      'transparent',
        borderWidth:      0,
        hoverOffset:      8,
      }],
    },
    options: {
      responsive:          true,
      maintainAspectRatio: true,
      animation: {
        duration: 500,
        easing:   'easeInOutQuart',
      },
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            padding:       14,
            font:          { size: 12 },
            color:         getLegendColor(),
            usePointStyle: true,
            pointStyle:    'circle',
          },
        },
        tooltip: {
          callbacks: {
            label: (context) => ` ${formatRupiah(context.parsed)}`,
          },
        },
      },
    },
  });
}

/**
 * Update data Chart.js tanpa destroy/recreate canvas.
 * Menggunakan chart.data dan chart.update() langsung.
 */
function updateChart() {
  const { labels, data, colors } = getChartData();
  const chartEmpty = document.getElementById('chartEmpty');

  if (transactions.length === 0) {
    expenseChart.data.labels              = [];
    expenseChart.data.datasets[0].data   = [];
    expenseChart.data.datasets[0].backgroundColor = [];
    expenseChart.update();
    chartEmpty.style.display = 'block';
    return;
  }

  chartEmpty.style.display = 'none';
  expenseChart.data.labels                       = labels;
  expenseChart.data.datasets[0].data             = data;
  expenseChart.data.datasets[0].backgroundColor  = colors;
  expenseChart.update();
}

// ============================================================
// 8. RENDER — SUMMARY PER KATEGORI
// ============================================================

/**
 * Render ringkasan total pengeluaran per kategori di bawah grafik.
 */
function renderSummary() {
  const summaryEl = document.getElementById('categorySummary');
  if (!summaryEl) return;

  if (transactions.length === 0) {
    summaryEl.innerHTML = '';
    return;
  }

  const totals = {};
  transactions.forEach(tx => {
    totals[tx.category] = (totals[tx.category] || 0) + tx.amount;
  });

  const grandTotal = transactions.reduce((acc, tx) => acc + tx.amount, 0);

  summaryEl.innerHTML = Object.entries(totals).map(([cat, amt]) => {
    const pct   = grandTotal > 0 ? Math.round((amt / grandTotal) * 100) : 0;
    const icon  = CATEGORY_ICONS[cat] || '📦';
    const color = CATEGORY_COLORS[cat] || '#94a3b8';
    return `
      <div class="summary-row">
        <span class="summary-icon">${icon}</span>
        <span class="summary-cat">${escapeHtml(cat)}</span>
        <div class="summary-bar-wrap">
          <div class="summary-bar" style="width:${pct}%; background:${color};"></div>
        </div>
        <span class="summary-pct">${pct}%</span>
        <span class="summary-amt">${formatRupiah(amt)}</span>
      </div>`;
  }).join('');
}

// ============================================================
// 9. MASTER RENDER — panggil semua render sekaligus
// ============================================================

/**
 * Render ulang seluruh UI: balance, list, chart, summary.
 */
function renderAll() {
  renderBalance();
  renderTransactions();
  updateChart();
  renderSummary();
}

// ============================================================
// 10. ADD TRANSACTION
// ============================================================

/**
 * Validasi form, buat objek transaksi baru, simpan ke state & storage.
 * @param {Event} e - submit event
 */
function handleAddTransaction(e) {
  e.preventDefault();

  const nameInput     = document.getElementById('txName');
  const amountInput   = document.getElementById('txAmount');
  const categoryInput = document.getElementById('txCategory');
  const errorEl       = document.getElementById('formError');

  const name     = nameInput.value.trim();
  const amount   = parseFloat(amountInput.value);
  const category = categoryInput.value;

  // Validasi: field kosong
  if (!name || !amountInput.value || !category) {
    errorEl.textContent = 'Semua kolom wajib diisi.';
    return;
  }

  // Validasi: nominal tidak valid atau negatif
  if (isNaN(amount) || amount <= 0) {
    errorEl.textContent = 'Nominal harus berupa angka positif lebih dari 0.';
    return;
  }

  errorEl.textContent = '';

  const newTx = {
    id:       Date.now(),
    name,
    amount,
    category,
  };

  transactions.push(newTx);
  saveTransactions();
  renderAll();

  // Reset form
  nameInput.value     = '';
  amountInput.value   = '';
  categoryInput.value = '';
  nameInput.focus();
}

// ============================================================
// 11. DELETE TRANSACTION
// ============================================================

/**
 * Hapus transaksi berdasarkan id dari state & storage (event delegation).
 * @param {Event} e - click event pada tx-list
 */
function handleDeleteTransaction(e) {
  const btn = e.target.closest('.btn-delete');
  if (!btn) return;

  const id = parseInt(btn.dataset.id, 10);
  transactions = transactions.filter(tx => tx.id !== id);
  saveTransactions();
  renderAll();
}

// ============================================================
// 12. SPENDING LIMIT
// ============================================================

/**
 * Set spending limit dari input dan simpan ke storage.
 */
function handleSetLimit() {
  const input = document.getElementById('alertLimit');
  const val   = parseFloat(input.value);
  const hint  = document.getElementById('limitHint');

  if (isNaN(val) || val < 0) {
    hint.textContent = 'Masukkan angka yang valid (≥ 0).';
    hint.classList.remove('active');
    return;
  }

  spendingLimit = val;
  saveLimit();

  if (val === 0) {
    hint.textContent = 'Limit dihapus. Tidak ada peringatan aktif.';
    hint.classList.remove('active');
  } else {
    hint.textContent = `Limit aktif: ${formatRupiah(val)} per transaksi.`;
    hint.classList.add('active');
  }

  input.value = '';
  renderTransactions(); // re-render untuk update kelas over-limit
}

// ============================================================
// 12. DARK / LIGHT MODE TOGGLE
// ============================================================

/**
 * Toggle tema dark/light, simpan preferensi ke LocalStorage.
 */
function handleThemeToggle() {
  const html      = document.documentElement;
  const icon      = document.getElementById('themeIcon');
  const isDark    = html.getAttribute('data-theme') === 'dark';
  const newTheme  = isDark ? 'light' : 'dark';

  html.setAttribute('data-theme', newTheme);
  icon.textContent = newTheme === 'dark' ? '☀️' : '🌙';
  localStorage.setItem('ebv_theme', newTheme);

  // Update warna legend chart sesuai tema baru
  if (expenseChart) {
    expenseChart.options.plugins.legend.labels.color = getLegendColor();
    expenseChart.update();
  }
}

// ============================================================
// 13. SORT
// ============================================================

/**
 * Ubah urutan tampilan transaksi sesuai pilihan dropdown.
 * @param {Event} e
 */
function handleSortChange(e) {
  sortOrder = e.target.value;
  renderTransactions();
}

// ============================================================
// 14. SECURITY HELPER
// ============================================================

/**
 * Escape karakter HTML untuk mencegah XSS pada output dinamis.
 * @param {string} str
 * @returns {string}
 */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// ============================================================
// 15. INIT — Entry Point
// ============================================================

/**
 * Inisialisasi aplikasi: load storage, render UI, pasang event listeners.
 */
function init() {
  loadFromStorage();
  initChart();
  renderAll();

  // Tampilkan limit aktif jika ada
  if (spendingLimit > 0) {
    const hint = document.getElementById('limitHint');
    hint.textContent = `Limit aktif: ${formatRupiah(spendingLimit)} per transaksi.`;
    hint.classList.add('active');
  }

  // Event Listeners
  document.getElementById('txForm')
    .addEventListener('submit', handleAddTransaction);

  document.getElementById('txList')
    .addEventListener('click', handleDeleteTransaction);

  document.getElementById('setLimitBtn')
    .addEventListener('click', handleSetLimit);

  document.getElementById('alertLimit')
    .addEventListener('keydown', e => { if (e.key === 'Enter') handleSetLimit(); });

  document.getElementById('themeToggle')
    .addEventListener('click', handleThemeToggle);

  document.getElementById('sortSelect')
    .addEventListener('change', handleSortChange);
}

// Jalankan setelah DOM siap
document.addEventListener('DOMContentLoaded', init);
