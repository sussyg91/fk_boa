/**
 * BOA Shared Chrome Injector  v4
 * Injects: utility bar · primary nav · logo+search+auth · product nav ·
 *          optional banking sub-tabs · mobile drawer · session-timeout modal
 *
 * Reads live owner info from localStorage (written by login.js) so every
 * page shows Jimmy & Regina Bear's real name/email/phone once signed in.
 *
 * Set before including this script:
 *   window.BOA_ROOT        — path prefix, e.g. '../../'
 *   window.BOA_ACTIVE_TAB  — product nav item id to highlight
 *   window.BOA_BANKING_TAB — banking sub-tab id to highlight
 */
(function () {
  'use strict';

  const ROOT       = window.BOA_ROOT        || './';
  const ACTIVE_TAB = window.BOA_ACTIVE_TAB  || '';
  const BANK_TAB   = window.BOA_BANKING_TAB || '';

  // Pull stored profile (available once logged in)
  const displayName = localStorage.getItem('boa_displayName') || 'Jimmy & Regina Bear';
  const firstName   = localStorage.getItem('boa_firstName')   || 'Jimmy';
  const email       = localStorage.getItem('boa_email')       || 'thegeniebear@gmail.com';
  const phone       = localStorage.getItem('boa_phone')       || '+1 (319) 240-2515';
  const custId      = localStorage.getItem('boa_customerId')  || 'BOA-JR-00482156';

  /* ── product nav items ─────────────────────────────────────── */
  const PRODUCT_TABS = [
    { id:'checking',     label:'Checking' },
    { id:'savings',      label:'Savings & CDs' },
    { id:'credit-cards', label:'Credit Cards' },
    { id:'home-loans',   label:'Home Loans' },
    { id:'auto-loans',   label:'Auto Loans' },
    { id:'merrill',      label:'Merrill Investing' },
    { id:'bmh',          label:'Better Money Habits' },
  ];

  /* ── banking sub-tab items ─────────────────────────────────── */
  const BANKING_TABS = [
    { id:'account-summary',   label:'Account Summary',   href: ROOT + 'pages/bank/account-summary.html' },
    { id:'account-activity',  label:'Account Activity',  href: ROOT + 'pages/bank/account-activity.html' },
    { id:'transfer-funds',    label:'Transfer Funds',    href: ROOT + 'pages/bank/transfer-funds.html' },
    { id:'pay-bills',         label:'Pay Bills',         href: ROOT + 'pages/bank/pay-bills.html' },
    { id:'online-statements', label:'Online Statements', href: ROOT + 'pages/bank/online-statements.html' },
    { id:'money-map',         label:'Money Map',         href: ROOT + 'pages/bank/money-map.html' },
  ];

  const productTabsHTML = PRODUCT_TABS.map(t => `
    <li class="home-product-nav__item">
      <a href="${ROOT}login.html" class="home-product-nav__link${t.id === ACTIVE_TAB ? ' is-active' : ''}">
        ${t.label} <i class="fa fa-chevron-down" aria-hidden="true"></i>
      </a>
    </li>`).join('');

  const bankingTabsHTML = BANKING_TABS.map(t => `
    <li class="shell-banking-tabs__item${t.id === BANK_TAB ? ' active' : ''}">
      <a href="${t.href}">${t.label}</a>
    </li>`).join('');

  const chrome = `
  <!-- ═══ UTILITY BAR ═══ -->
  <div class="home-utility-bar">
    <div class="BOA-container home-utility-bar__inner">
      <span class="home-utility-bar__fdic">
        <strong>Bank of America</strong> deposit products &nbsp;
        <strong class="home-utility-bar__fdic-logo">FDIC</strong>
        <em>FDIC Insured · Backed by the full faith and credit of the U.S. Government</em>
      </span>
    </div>
  </div>

  <!-- ═══ PRIMARY NAV ═══ -->
  <nav class="home-primary-nav" aria-label="Primary navigation">
    <div class="BOA-container home-primary-nav__inner">
      <ul class="home-primary-nav__list" role="list">
        <li class="home-primary-nav__item active"><a href="${ROOT}index.html">Personal</a></li>
        <li class="home-primary-nav__item"><a href="${ROOT}login.html">Wealth Management</a></li>
        <li class="home-primary-nav__item"><a href="${ROOT}login.html">Business</a></li>
        <li class="home-primary-nav__item"><a href="${ROOT}login.html">Corporations &amp; Institutions</a></li>
        <li class="home-primary-nav__sep"></li>
        <li class="home-primary-nav__item home-primary-nav__item--right"><a href="${ROOT}help.html">Security</a></li>
        <li class="home-primary-nav__item home-primary-nav__item--right"><a href="${ROOT}login.html">About Us</a></li>
        <li class="home-primary-nav__item home-primary-nav__item--right"><a href="${ROOT}login.html">En español</a></li>
        <li class="home-primary-nav__item home-primary-nav__item--right"><a href="${ROOT}feedback.html">Contact Us</a></li>
        <li class="home-primary-nav__item home-primary-nav__item--right"><a href="${ROOT}help.html">Help</a></li>
      </ul>
    </div>
  </nav>

  <!-- ═══ LOGO + SEARCH + AUTH BAR ═══ -->
  <div class="home-logo-bar">
    <div class="BOA-container home-logo-bar__inner">
      <a href="${ROOT}index.html" class="home-logo-bar__brand">
        <img src="${ROOT}downloaded_files/img/boa_long.jpg" alt="Bank of America" class="home-logo-bar__img"
          width="160" height="36" loading="eager">
      </a>
      <div class="home-logo-bar__right">
        <form action="${ROOT}search.html" class="home-logo-bar__search" role="search">
          <input type="text" name="searchTerm" placeholder="Search" aria-label="Search Bank of America"
            autocomplete="off" spellcheck="false">
          <button type="submit" aria-label="Submit search"><i class="fa fa-search" aria-hidden="true"></i></button>
        </form>

        <div class="home-logo-bar__auth">
          <!-- Guest: Sign In button -->
          <a href="${ROOT}login.html" class="home-logo-bar__signin BOA-nav--guest">
            <i class="fa fa-right-to-bracket" aria-hidden="true"></i> Sign In
          </a>

          <!-- Logged-in: notification bell -->
          <div class="BOA-nav-dropdown BOA-nav--user" style="display:none">
            <button class="BOA-notif-btn BOA-nav-dropdown__toggle" aria-label="Notifications" aria-expanded="false">
              <i class="fa fa-bell" aria-hidden="true"></i>
              <span class="BOA-notif-badge hidden" id="notif-badge" aria-hidden="true">0</span>
            </button>
            <div class="BOA-notif-panel">
              <div class="BOA-notif-panel__head">
                <span class="BOA-notif-panel__title">Notifications</span>
                <button class="BOA-notif-panel__clear" onclick="clearAllNotifications()">Mark all read</button>
              </div>
              <div id="notif-list"></div>
            </div>
          </div>

          <!-- Logged-in: user dropdown -->
          <div class="BOA-nav-dropdown BOA-nav--user" style="display:none">
            <button class="BOA-nav-dropdown__toggle home-logo-bar__user-btn" aria-expanded="false">
              <i class="fa fa-user-circle" aria-hidden="true"></i>
              <span class="BOA-desktop-only"> ${firstName}</span>
              <i class="fa fa-chevron-down" aria-hidden="true" style="font-size:.65rem"></i>
            </button>
            <div class="BOA-nav-dropdown__menu" style="min-width:260px">
              <!-- Profile block -->
              <div style="padding:.9rem 1rem 1rem;border-bottom:1px solid var(--BOA-gray-100)">
                <div style="display:flex;align-items:center;gap:.65rem;margin-bottom:.6rem">
                  <div style="width:38px;height:38px;border-radius:50%;background:#003580;color:#fff;display:flex;align-items:center;justify-content:center;font-size:.95rem;font-weight:800;flex-shrink:0">
                    JB
                  </div>
                  <div>
                    <div style="font-weight:700;font-size:.875rem;color:var(--BOA-navy)">${displayName}</div>
                    <div style="font-size:.72rem;color:var(--BOA-gray-500)">Primary &amp; Joint Account</div>
                  </div>
                </div>
                <div style="display:flex;flex-direction:column;gap:.3rem">
                  <div style="display:flex;align-items:center;gap:.5rem;font-size:.75rem;color:var(--BOA-gray-500)">
                    <i class="fa fa-envelope" aria-hidden="true" style="width:14px;text-align:center;color:#003580"></i>
                    <span>${email}</span>
                  </div>
                  <div style="display:flex;align-items:center;gap:.5rem;font-size:.75rem;color:var(--BOA-gray-500)">
                    <i class="fa fa-phone" aria-hidden="true" style="width:14px;text-align:center;color:#003580"></i>
                    <span>${phone}</span>
                  </div>
                  <div style="display:flex;align-items:center;gap:.5rem;font-size:.75rem;color:var(--BOA-gray-500)">
                    <i class="fa fa-id-badge" aria-hidden="true" style="width:14px;text-align:center;color:#003580"></i>
                    <span>ID: ${custId}</span>
                  </div>
                </div>
              </div>
              <!-- Actions -->
              <a class="BOA-nav-dropdown__item" href="${ROOT}pages/bank/account-summary.html">
                <i class="fa fa-wallet" aria-hidden="true"></i> Account Summary
              </a>
              <span class="BOA-nav-dropdown__item disabled">
                <i class="fa fa-sliders" aria-hidden="true"></i> Account Settings
              </span>
              <div class="BOA-nav-dropdown__divider"></div>
              <a class="BOA-nav-dropdown__item" href="${ROOT}help.html">
                <i class="fa fa-circle-question" aria-hidden="true"></i> Help &amp; Support
              </a>
              <div class="BOA-nav-dropdown__divider"></div>
              <a class="BOA-nav-dropdown__item" href="${ROOT}logout.html" style="color:var(--BOA-red)">
                <i class="fa fa-right-from-bracket" aria-hidden="true"></i> Sign Out
              </a>
            </div>
          </div>

          <!-- Hamburger (mobile) -->
          <button class="BOA-hamburger" id="BOA-hamburger" aria-label="Open menu" aria-expanded="false">
            <i class="fa fa-bars" aria-hidden="true"></i>
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- ═══ PRODUCT NAV ═══ -->
  <nav class="home-product-nav" aria-label="Product navigation">
    <div class="BOA-container">
      <ul class="home-product-nav__list" role="list">
        ${productTabsHTML}
      </ul>
    </div>
  </nav>

  ${BANK_TAB ? `
  <!-- ═══ BANKING SUB-TABS ═══ -->
  <div class="shell-banking-tabs">
    <div class="BOA-container">
      <ul class="shell-banking-tabs__list" role="list">
        ${bankingTabsHTML}
      </ul>
    </div>
  </div>` : ''}

  <!-- ═══ MOBILE DRAWER ═══ -->
  <div class="BOA-mobile-nav" id="BOA-mobile-nav" aria-hidden="true">
    <div class="BOA-mobile-nav__overlay"></div>
    <div class="BOA-mobile-nav__drawer">
      <div class="BOA-mobile-nav__head">
        <a href="${ROOT}index.html" style="display:flex;align-items:center;gap:.5rem;text-decoration:none">
          <img src="${ROOT}downloaded_files/img/boa_long.jpg" alt="Bank of America"
            style="height:26px;width:auto;border-radius:3px" width="100" height="26" loading="lazy">
        </a>
        <button class="BOA-mobile-nav__close" aria-label="Close menu"><i class="fa fa-xmark" aria-hidden="true"></i></button>
      </div>

      <!-- Logged-in profile strip -->
      <div class="BOA-mobile-nav__user BOA-nav--user" id="mobile-nav-user" style="display:none">
        <div class="BOA-mobile-nav__user-name">
          <i class="fa fa-user-circle" aria-hidden="true" style="margin-right:.4rem"></i>${displayName}
        </div>
        <div class="BOA-mobile-nav__user-sub">${email}</div>
        <div class="BOA-mobile-nav__user-sub" style="margin-top:.15rem">${phone}</div>
      </div>
      <!-- Guest strip -->
      <div class="BOA-mobile-nav__user BOA-nav--guest" id="mobile-nav-guest">
        <div class="BOA-mobile-nav__user-name" style="color:rgba(255,255,255,.6);font-size:.85rem">Not signed in</div>
      </div>

      <div class="BOA-mobile-nav__links">
        <div class="BOA-mobile-nav__section">Main</div>
        <a href="${ROOT}index.html"         class="BOA-mobile-nav__link"><i class="fa fa-house" aria-hidden="true"></i> Home</a>
        <a href="${ROOT}online-banking.html" class="BOA-mobile-nav__link"><i class="fa fa-building-columns" aria-hidden="true"></i> Online Banking</a>
        <a href="${ROOT}feedback.html"       class="BOA-mobile-nav__link"><i class="fa fa-envelope" aria-hidden="true"></i> Feedback</a>

        <div class="BOA-mobile-nav__divider BOA-nav--user" style="display:none"></div>
        <div class="BOA-mobile-nav__section BOA-nav--user" style="display:none">My Banking</div>
        <a href="${ROOT}pages/bank/account-summary.html"   class="BOA-mobile-nav__link BOA-nav--user" style="display:none"><i class="fa fa-wallet" aria-hidden="true"></i> Account Summary</a>
        <a href="${ROOT}pages/bank/account-activity.html"  class="BOA-mobile-nav__link BOA-nav--user" style="display:none"><i class="fa fa-list-ul" aria-hidden="true"></i> Account Activity</a>
        <a href="${ROOT}pages/bank/transfer-funds.html"    class="BOA-mobile-nav__link BOA-nav--user" style="display:none"><i class="fa fa-right-left" aria-hidden="true"></i> Transfer Funds</a>
        <a href="${ROOT}pages/bank/pay-bills.html"         class="BOA-mobile-nav__link BOA-nav--user" style="display:none"><i class="fa fa-credit-card" aria-hidden="true"></i> Pay Bills</a>
        <a href="${ROOT}pages/bank/money-map.html"         class="BOA-mobile-nav__link BOA-nav--user" style="display:none"><i class="fa fa-chart-pie" aria-hidden="true"></i> Money Map</a>
        <a href="${ROOT}pages/bank/online-statements.html" class="BOA-mobile-nav__link BOA-nav--user" style="display:none"><i class="fa fa-file-lines" aria-hidden="true"></i> Statements</a>

        <div class="BOA-mobile-nav__divider"></div>
        <div class="BOA-mobile-nav__section">Support</div>
        <a href="${ROOT}help.html"     class="BOA-mobile-nav__link"><i class="fa fa-circle-question" aria-hidden="true"></i> Help Center</a>
        <a href="${ROOT}faq.html"      class="BOA-mobile-nav__link"><i class="fa fa-comments" aria-hidden="true"></i> FAQ</a>
        <a href="${ROOT}locations.html" class="BOA-mobile-nav__link"><i class="fa fa-location-dot" aria-hidden="true"></i> Locations</a>

        <div class="BOA-mobile-nav__divider BOA-nav--user" style="display:none"></div>
        <a href="${ROOT}logout.html" class="BOA-mobile-nav__link BOA-nav--user" style="display:none;color:#f87171">
          <i class="fa fa-right-from-bracket" aria-hidden="true"></i> Sign Out
        </a>
        <a href="${ROOT}login.html" class="BOA-mobile-nav__link BOA-nav--guest" style="color:#60a5fa">
          <i class="fa fa-right-to-bracket" aria-hidden="true"></i> Sign In
        </a>
      </div>
    </div>
  </div>

  <!-- ═══ SESSION TIMEOUT MODAL ═══ -->
  <div id="modal-session-timeout" class="BOA-modal-overlay" style="display:none"
    role="dialog" aria-modal="true" aria-labelledby="session-modal-title">
    <div class="BOA-modal BOA-modal--sm">
      <div class="BOA-modal__header">
        <h4 class="BOA-modal__title" id="session-modal-title">
          <i class="fa fa-clock" aria-hidden="true" style="color:var(--BOA-amber);margin-right:.5rem"></i>Session Expiring
        </h4>
      </div>
      <div class="BOA-modal__body" style="text-align:center">
        <div class="BOA-timeout-ring">
          <svg width="80" height="80" viewBox="0 0 80 80" aria-hidden="true">
            <circle class="BOA-timeout-ring__track" cx="40" cy="40" r="35"/>
            <circle class="BOA-timeout-ring__fill" id="timeout-ring-fill" cx="40" cy="40" r="35"/>
          </svg>
          <div class="BOA-timeout-ring__text" id="timeout-count" aria-live="polite">120</div>
        </div>
        <p style="font-size:.9rem;color:var(--BOA-gray-700);margin:0 0 .25rem">Your session will expire in</p>
        <p style="font-size:.8rem;color:var(--BOA-gray-500)">Move your mouse or click below to stay signed in.</p>
      </div>
      <div class="BOA-modal__footer" style="justify-content:center;gap:.75rem">
        <button id="btn-logout-now"     class="BOA-btn BOA-btn--secondary BOA-btn--sm">Sign Out Now</button>
        <button id="btn-stay-signed-in" class="BOA-btn BOA-btn--primary">Stay Signed In</button>
      </div>
    </div>
  </div>`;

  document.body.insertAdjacentHTML('afterbegin', chrome);

  /* ── Auth-area extra styles injected once ──────────────────── */
  const style = document.createElement('style');
  style.textContent = `
    .home-logo-bar__right{display:flex;align-items:center;gap:.75rem}
    .home-logo-bar__auth{display:flex;align-items:center;gap:.5rem}
    .home-logo-bar__signin{display:inline-flex;align-items:center;gap:.4rem;
      background:#004b87;color:#fff;border-radius:4px;padding:.4rem 1rem;
      font-size:.8rem;font-weight:700;text-decoration:none;
      transition:background-color .15s ease}
    .home-logo-bar__signin:hover{background:#003a6b;color:#fff;text-decoration:none}
    .home-logo-bar__user-btn{background:none;border:1px solid #ccc;border-radius:4px;
      padding:.4rem .75rem;font-size:.8rem;color:#333;cursor:pointer;
      display:flex;align-items:center;gap:.35rem;font-family:var(--font-sans);
      transition:border-color .15s ease,color .15s ease}
    .home-logo-bar__user-btn:hover{border-color:#005eb8;color:#005eb8}
    .BOA-desktop-only{display:inline}
    @media(max-width:768px){.BOA-desktop-only{display:none}}
  `;
  document.head.appendChild(style);
})();
