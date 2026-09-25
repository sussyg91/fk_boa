/**
 * BOA Account Activity  v2
 * Reads from data.js (BOA_ACCOUNTS, BOA_TRANSACTIONS, boaFmt).
 * Supports: account selector, search filter, URL ?accountId= param,
 *           category badges, running-balance column.
 */
'use strict';

/* ── Category badge colours ──────────────────────────────────── */
const CAT_BADGE = {
  payroll:   { label:'Payroll',      cls:'BOA-badge--success' },
  transfer:  { label:'Transfer',     cls:'BOA-badge--info'    },
  atm:       { label:'ATM',          cls:'BOA-badge--warning' },
  utilities: { label:'Utilities',    cls:'BOA-badge--gray'    },
  groceries: { label:'Groceries',    cls:'BOA-badge--gray'    },
  shopping:  { label:'Shopping',     cls:'BOA-badge--gray'    },
  dining:    { label:'Dining',       cls:'BOA-badge--gray'    },
  housing:   { label:'Housing',      cls:'BOA-badge--info'    },
  auto:      { label:'Auto',         cls:'BOA-badge--gray'    },
  gas:       { label:'Gas',          cls:'BOA-badge--gray'    },
  subscr:    { label:'Subscription', cls:'BOA-badge--gray'    },
  deposit:   { label:'Deposit',      cls:'BOA-badge--success' },
  loan:      { label:'Loan Pmt',     cls:'BOA-badge--danger'  },
  payment:   { label:'Payment',      cls:'BOA-badge--success' },
  interest:  { label:'Interest',     cls:'BOA-badge--success' },
  dividend:  { label:'Dividend',     cls:'BOA-badge--success' },
  trade:     { label:'Trade',        cls:'BOA-badge--info'    },
  credit:    { label:'Credit',       cls:'BOA-badge--success' },
};

function catBadge(cat) {
  const c = CAT_BADGE[cat] || { label: cat || '—', cls: 'BOA-badge--gray' };
  return `<span class="BOA-badge ${c.cls}" style="font-size:.7rem">${c.label}</span>`;
}

/* ── Table builder ──────────────────────────────────────────── */
function buildTable(transactions) {
  if (!transactions.length) {
    return `<div class="BOA-empty" style="padding:2.5rem 1rem">
      <i class="fa fa-inbox" style="font-size:2rem;opacity:.3;display:block;margin-bottom:.75rem"></i>
      <p>No transactions found for this account.</p>
    </div>`;
  }

  // Format date for display: 'YYYY-MM-DD' → 'Nov 12, 2026'
  function fmtDate(d) {
    const dt = new Date(d + 'T00:00:00');
    return dt.toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' });
  }

  const rows = transactions.map(t => {
    const isDeposit = t.deposit != null;
    const amtClass  = isDeposit ? 'amount-positive' : 'amount-negative';
    const amtSign   = isDeposit ? '+' : '−';
    const amtVal    = isDeposit ? t.deposit : t.withdrawal;
    return `<tr>
      <td style="white-space:nowrap">${fmtDate(t.date)}</td>
      <td>${t.desc}</td>
      <td>${catBadge(t.category)}</td>
      <td class="${amtClass}" style="text-align:right;white-space:nowrap;font-variant-numeric:tabular-nums">
        ${amtSign}${boaFmt(amtVal)}
      </td>
      <td style="text-align:right;white-space:nowrap;font-variant-numeric:tabular-nums;color:#555">
        ${boaFmt(t.balance)}
      </td>
      <td>
        <span class="BOA-badge BOA-badge--success" style="font-size:.68rem">
          <i class="fa fa-circle" style="font-size:.4rem"></i> ${t.status}
        </span>
      </td>
    </tr>`;
  }).join('');

  return `<div class="BOA-table-wrap">
    <table class="BOA-table">
      <thead>
        <tr>
          <th>Date</th>
          <th>Description</th>
          <th>Category</th>
          <th style="text-align:right">Amount</th>
          <th style="text-align:right">Balance</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  </div>`;
}

/* ── Render helpers ─────────────────────────────────────────── */
let currentTransactions = [];

function renderAccount(id) {
  const acc   = BOA_ACCOUNTS[id] || BOA_ACCOUNTS['1'];
  const txns  = (BOA_TRANSACTIONS[id] || []).slice(); // newest-first already

  currentTransactions = txns;

  const labelEl = document.getElementById('aa_account_label');
  const countEl = document.getElementById('aa_count');
  const balEl   = document.getElementById('aa_balance');
  const maskEl  = document.getElementById('aa_mask');
  const container = document.getElementById('all_transactions_for_account');

  if (labelEl) labelEl.textContent = acc.label + ' — Transactions';
  if (countEl) countEl.textContent = txns.length + ' transaction' + (txns.length !== 1 ? 's' : '');
  if (balEl)   balEl.textContent   = boaFmt(acc.balance);
  if (maskEl)  maskEl.textContent  = acc.mask;
  if (container) container.innerHTML = buildTable(txns);
}

function filterTransactions(query) {
  const q        = query.toLowerCase().trim();
  const filtered = q
    ? currentTransactions.filter(t =>
        t.desc.toLowerCase().includes(q) ||
        (t.category || '').toLowerCase().includes(q)
      )
    : currentTransactions;

  const container = document.getElementById('all_transactions_for_account');
  const countEl   = document.getElementById('aa_count');
  if (container) container.innerHTML = buildTable(filtered);
  if (countEl)   countEl.textContent = filtered.length + ' transaction' + (filtered.length !== 1 ? 's' : '');
}

/* ── Initialise ─────────────────────────────────────────────── */
(function init() {
  const params  = new URLSearchParams(window.location.search);
  const urlId   = params.get('accountId') || '1';

  // Populate dropdown options from BOA_ACCOUNTS
  const sel = document.getElementById('aa_accountId');
  if (sel) {
    sel.innerHTML = Object.keys(BOA_ACCOUNTS).map(id => {
      const a = BOA_ACCOUNTS[id];
      return `<option value="${id}"${id === urlId ? ' selected' : ''}>${a.label} (${a.mask})</option>`;
    }).join('');

    sel.addEventListener('change', function () {
      renderAccount(this.value);
      const f = document.getElementById('aa_filter');
      if (f) f.value = '';
    });
  }

  const filterEl = document.getElementById('aa_filter');
  if (filterEl) {
    filterEl.addEventListener('input', function () {
      filterTransactions(this.value);
    });
  }

  renderAccount(urlId);
})();
