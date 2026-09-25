/**
 * BOA Online Statements  v2
 * Reads from data.js (BOA_ACCOUNTS, BOA_STATEMENTS, BOA_PROFILE, boaFmt).
 * Generates real statements for ALL 6 accounts with accurate opening/
 * closing balances, deposit/withdrawal totals, and a full transaction list.
 * "PDF" renders a print-ready statement in a new window.
 */
'use strict';

/* ── Helpers ────────────────────────────────────────────────── */
function fmtDate(d) {
  const dt = new Date(d + 'T00:00:00');
  return dt.toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' });
}

/* ── Populate account dropdown from BOA_ACCOUNTS ────────────── */
(function populateAccountDropdown() {
  const sel = document.getElementById('os_account');
  if (!sel) return;
  sel.innerHTML = Object.keys(BOA_ACCOUNTS).map(id => {
    const a = BOA_ACCOUNTS[id];
    return `<option value="${id}">${a.label} (${a.mask})</option>`;
  }).join('');
})();

/* ── Populate year dropdown dynamically ─────────────────────── */
(function populateYears() {
  const sel = document.getElementById('os_year');
  if (!sel) return;
  // Collect all years from ALL accounts
  const yearSet = new Set();
  Object.keys(BOA_STATEMENTS).forEach(accId => {
    Object.keys(BOA_STATEMENTS[accId]).forEach(yr => yearSet.add(yr));
  });
  const years = Array.from(yearSet).sort((a,b) => b - a);
  sel.innerHTML = years.map(y => `<option value="${y}">${y}</option>`).join('');
})();

/* ── Statement list renderer ─────────────────────────────────── */
function renderStatementList() {
  const accId     = document.getElementById('os_account')?.value || '1';
  const year      = document.getElementById('os_year')?.value    || '2026';
  const container = document.getElementById('os_list');
  const heading   = document.getElementById('os_heading');
  const countEl   = document.getElementById('os_count');
  const acc       = BOA_ACCOUNTS[accId];

  if (heading) heading.textContent = `${acc ? acc.label : ''} — ${year} Statements`;

  const stmts = (BOA_STATEMENTS[accId] || {})[year] || [];

  if (countEl) {
    countEl.textContent = stmts.length + ' statement' + (stmts.length !== 1 ? 's' : '');
  }

  if (!container) return;

  if (!stmts.length) {
    container.innerHTML = `<div class="BOA-empty" style="padding:2.5rem 1rem">
      <i class="fa fa-folder-open" style="font-size:2rem;opacity:.3;display:block;margin-bottom:.75rem"></i>
      <p>No statements available for this account and period.</p>
    </div>`;
    return;
  }

  container.innerHTML = stmts.map((s, idx) => `
    <div class="os-stmt-row">
      <div class="os-stmt-info">
        <div class="os-stmt-icon" aria-hidden="true"><i class="fa fa-file-lines"></i></div>
        <div>
          <div class="os-stmt-name">${s.month}</div>
          <div class="os-stmt-sub">${s.period} &nbsp;·&nbsp; ${s.transactions} transaction${s.transactions !== 1 ? 's' : ''}</div>
        </div>
      </div>
      <div style="display:flex;align-items:center;gap:1.5rem;flex-wrap:wrap">
        <div style="text-align:right">
          <div style="font-size:.7rem;color:#888;text-transform:uppercase;letter-spacing:.05em">Opening</div>
          <div style="font-size:.85rem;font-weight:600;color:#444;font-variant-numeric:tabular-nums">${boaFmt(s.openingBalance)}</div>
        </div>
        <div style="text-align:right">
          <div style="font-size:.7rem;color:#888;text-transform:uppercase;letter-spacing:.05em">Closing</div>
          <div style="font-size:.9rem;font-weight:800;color:#0a2540;font-variant-numeric:tabular-nums">${boaFmt(s.closingBalance)}</div>
        </div>
        <div class="os-stmt-actions">
          <button class="BOA-btn BOA-btn--outline BOA-btn--sm"
            onclick="viewStatement('${accId}','${year}',${idx})"
            aria-label="View ${s.month} statement">
            <i class="fa fa-eye" aria-hidden="true"></i> View
          </button>
          <button class="BOA-btn BOA-btn--primary BOA-btn--sm"
            onclick="printStatement('${accId}','${year}',${idx})"
            aria-label="Download PDF for ${s.month}">
            <i class="fa fa-download" aria-hidden="true"></i> PDF
          </button>
        </div>
      </div>
    </div>`).join('');
}

/* ── Inline statement detail modal ──────────────────────────── */
function viewStatement(accId, year, idx) {
  const stmt = (BOA_STATEMENTS[accId] || {})[year]?.[idx];
  const acc  = BOA_ACCOUNTS[accId];
  if (!stmt || !acc) return;

  const txRows = stmt.txnList.map(t => {
    const isDeposit = t.deposit != null;
    const amtClass  = isDeposit ? 'amount-positive' : 'amount-negative';
    const amtSign   = isDeposit ? '+' : '−';
    const amtVal    = isDeposit ? t.deposit : t.withdrawal;
    return `<tr>
      <td style="white-space:nowrap;font-size:.82rem">${fmtDate(t.date)}</td>
      <td style="font-size:.82rem">${t.desc}</td>
      <td class="${amtClass}" style="text-align:right;white-space:nowrap;font-variant-numeric:tabular-nums;font-size:.82rem">
        ${amtSign}${boaFmt(amtVal)}
      </td>
      <td style="text-align:right;white-space:nowrap;font-variant-numeric:tabular-nums;font-size:.82rem;color:#555">
        ${boaFmt(t.balance)}
      </td>
    </tr>`;
  }).join('');

  const html = `
    <div style="padding:1.25rem">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:.75rem;margin-bottom:1.25rem">
        <div>
          <div style="font-size:1rem;font-weight:800;color:#0a2540">${acc.label} (${acc.mask})</div>
          <div style="font-size:.8rem;color:#888">${stmt.period}</div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:.75rem;text-align:center">
          <div style="background:#f0f4fb;border-radius:6px;padding:.6rem .85rem">
            <div style="font-size:.65rem;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:#888">Opening Balance</div>
            <div style="font-size:.95rem;font-weight:800;color:#0a2540;font-variant-numeric:tabular-nums">${boaFmt(stmt.openingBalance)}</div>
          </div>
          <div style="background:#dcfce7;border-radius:6px;padding:.6rem .85rem">
            <div style="font-size:.65rem;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:#888">Total Deposits</div>
            <div style="font-size:.95rem;font-weight:800;color:#16a34a;font-variant-numeric:tabular-nums">+${boaFmt(stmt.totalDeposits)}</div>
          </div>
          <div style="background:#fee2e2;border-radius:6px;padding:.6rem .85rem">
            <div style="font-size:.65rem;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:#888">Total Withdrawals</div>
            <div style="font-size:.95rem;font-weight:800;color:#c8102e;font-variant-numeric:tabular-nums">−${boaFmt(stmt.totalWithdrawals)}</div>
          </div>
        </div>
      </div>
      <!-- Closing balance banner -->
      <div style="background:#003580;color:#fff;border-radius:8px;padding:.85rem 1.1rem;display:flex;justify-content:space-between;align-items:center;margin-bottom:1.1rem;flex-wrap:wrap;gap:.5rem">
        <span style="font-size:.85rem;font-weight:600">Closing Balance — ${stmt.month}</span>
        <span style="font-size:1.25rem;font-weight:900;font-variant-numeric:tabular-nums">${boaFmt(stmt.closingBalance)}</span>
      </div>
      <!-- Transaction list -->
      <div class="BOA-table-wrap" style="max-height:340px;overflow-y:auto">
        <table class="BOA-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th style="text-align:right">Amount</th>
              <th style="text-align:right">Balance</th>
            </tr>
          </thead>
          <tbody>${txRows}</tbody>
        </table>
      </div>
    </div>`;

  // Inject into modal
  const modalBody = document.getElementById('stmt_modal_body');
  const modalTitle = document.getElementById('stmt_modal_title');
  if (modalBody)  modalBody.innerHTML = html;
  if (modalTitle) modalTitle.textContent = stmt.month + ' — ' + acc.label;

  // Store for PDF
  window._stmtPrintAccId = accId;
  window._stmtPrintYear  = year;
  window._stmtPrintIdx   = idx;

  if (typeof openModal === 'function') openModal('modal-stmt-view');
}

/* ── Print/PDF renderer ──────────────────────────────────────── */
function printStatement(accId, year, idx) {
  const stmt = (BOA_STATEMENTS[accId] || {})[year]?.[idx];
  const acc  = BOA_ACCOUNTS[accId];
  if (!stmt || !acc) return;

  const profile = typeof BOA_PROFILE !== 'undefined' ? BOA_PROFILE : {
    displayName: localStorage.getItem('boa_displayName') || 'Jimmy & Regina Bear',
    phone:       localStorage.getItem('boa_phone')       || '+1 (319) 240-2515',
    email:       localStorage.getItem('boa_email')       || 'thegeniebear@gmail.com',
    customerId:  localStorage.getItem('boa_customerId')  || 'BOA-JR-00482156',
  };

  const txRows = stmt.txnList.map(t => {
    const isDeposit = t.deposit != null;
    return `<tr>
      <td>${fmtDate(t.date)}</td>
      <td>${t.desc}</td>
      <td style="text-align:right;color:${isDeposit ? '#16a34a' : '#c8102e'}">
        ${isDeposit ? '+' : '−'}${boaFmt(isDeposit ? t.deposit : t.withdrawal)}
      </td>
      <td style="text-align:right">${boaFmt(t.balance)}</td>
    </tr>`;
  }).join('');

  const win = window.open('', '_blank', 'width=860,height=960');
  win.document.write(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Statement — ${stmt.month} — ${acc.label}</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:'Segoe UI',Arial,sans-serif;font-size:12px;color:#222;padding:32px}
    .hdr{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:3px solid #003580;padding-bottom:16px;margin-bottom:20px}
    .hdr-logo{font-size:20px;font-weight:900;color:#003580;letter-spacing:-.5px}
    .hdr-logo span{color:#c8102e}
    .hdr-right{text-align:right;font-size:11px;color:#555}
    .hdr-right b{color:#222}
    .section-title{font-size:13px;font-weight:700;color:#003580;border-bottom:1px solid #ddd;padding-bottom:4px;margin:16px 0 8px}
    .info-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:16px}
    .info-cell{background:#f5f7fa;border-radius:4px;padding:8px 12px}
    .info-cell label{display:block;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:#888;margin-bottom:2px}
    .info-cell span{font-size:12px;font-weight:700;color:#0a2540}
    .summary-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:16px}
    .summary-cell{background:#f5f7fa;border-radius:4px;padding:8px 12px;text-align:center}
    .summary-cell label{display:block;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:#888;margin-bottom:3px}
    .summary-cell .val{font-size:14px;font-weight:900}
    .closing-banner{background:#003580;color:#fff;border-radius:6px;padding:10px 16px;display:flex;justify-content:space-between;align-items:center;margin-bottom:16px}
    .closing-banner .label{font-size:12px;font-weight:600}
    .closing-banner .amount{font-size:20px;font-weight:900}
    table{width:100%;border-collapse:collapse;font-size:11px}
    thead th{background:#003580;color:#fff;padding:6px 8px;text-align:left;font-size:10px;text-transform:uppercase;letter-spacing:.04em}
    tbody tr:nth-child(even){background:#f9f9f9}
    tbody td{padding:5px 8px;border-bottom:1px solid #eee;vertical-align:middle}
    .pos{color:#16a34a;font-weight:700}
    .neg{color:#c8102e;font-weight:700}
    .footer{margin-top:24px;border-top:1px solid #ddd;padding-top:12px;font-size:10px;color:#888;text-align:center;line-height:1.6}
    @media print{body{padding:16px}}
  </style>
</head>
<body>
  <div class="hdr">
    <div>
      <div class="hdr-logo">Bank of <span>America</span></div>
      <div style="font-size:11px;color:#555;margin-top:4px">Account Statement</div>
    </div>
    <div class="hdr-right">
      <b>${profile.displayName || (profile.primary?.fullName + ' &amp; ' + profile.joint?.fullName)}</b><br>
      ${profile.email || ''}<br>
      ${profile.phone || ''}<br>
      Customer ID: ${profile.customerId || ''}
    </div>
  </div>

  <div class="section-title">Account Information</div>
  <div class="info-grid">
    <div class="info-cell"><label>Account Name</label><span>${acc.label}</span></div>
    <div class="info-cell"><label>Account Number</label><span>${acc.mask}</span></div>
    <div class="info-cell"><label>Statement Period</label><span>${stmt.period}</span></div>
    <div class="info-cell"><label>Account Type</label><span>${acc.type.charAt(0).toUpperCase() + acc.type.slice(1)}</span></div>
    ${acc.routingNo ? `<div class="info-cell"><label>Routing Number</label><span>${acc.routingNo}</span></div>` : ''}
    ${acc.rate      ? `<div class="info-cell"><label>Interest Rate</label><span>${acc.rate || acc.interestRate}</span></div>` : ''}
  </div>

  <div class="section-title">Statement Summary</div>
  <div class="summary-grid">
    <div class="summary-cell">
      <label>Opening Balance</label>
      <div class="val" style="color:#0a2540">${boaFmt(stmt.openingBalance)}</div>
    </div>
    <div class="summary-cell">
      <label>Total Deposits</label>
      <div class="val pos">+${boaFmt(stmt.totalDeposits)}</div>
    </div>
    <div class="summary-cell">
      <label>Total Withdrawals</label>
      <div class="val neg">−${boaFmt(stmt.totalWithdrawals)}</div>
    </div>
    <div class="summary-cell">
      <label>Transactions</label>
      <div class="val" style="color:#0a2540">${stmt.transactions}</div>
    </div>
  </div>

  <div class="closing-banner">
    <div class="label">Closing Balance — ${stmt.month}</div>
    <div class="amount">${boaFmt(stmt.closingBalance)}</div>
  </div>

  <div class="section-title">Transaction Detail</div>
  <table>
    <thead>
      <tr>
        <th>Date</th>
        <th>Description</th>
        <th style="text-align:right">Amount</th>
        <th style="text-align:right">Balance</th>
      </tr>
    </thead>
    <tbody>${txRows}</tbody>
  </table>

  <div class="footer">
    Bank of America, N.A. &nbsp;·&nbsp; Member FDIC &nbsp;·&nbsp; Equal Housing Lender<br>
    This statement is provided for informational purposes. This is a simulated banking frontend for educational use only.<br>
    Questions? Call 1-800-432-1000 &nbsp;·&nbsp; bankofamerica.com
  </div>

  <script>window.onload = function(){ window.print(); }<\/script>
</body>
</html>`);
  win.document.close();
}

/* ── Wire events & initial render ───────────────────────────── */
document.getElementById('os_account')?.addEventListener('change', renderStatementList);
document.getElementById('os_year')?.addEventListener('change',    renderStatementList);

renderStatementList();
