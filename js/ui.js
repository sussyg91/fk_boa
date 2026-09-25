/**
 * BOA UI Utilities v2
 * Dropdowns · Modals · Hamburger · Session Timeout · Notifications · Toasts
 */

'use strict';

const BOA_TOKEN = 'd9fe4ef5-c5e7-4d17-9a37-ea8d21c019a6';

/* ================================================================
   DROPDOWN TOGGLE
   ================================================================ */
document.addEventListener('click', function (e) {
  const toggle = e.target.closest('.BOA-nav-dropdown__toggle');
  if (toggle) {
    const dropdown = toggle.closest('.BOA-nav-dropdown');
    const isOpen = dropdown.classList.contains('open');
    document.querySelectorAll('.BOA-nav-dropdown.open').forEach(d => d.classList.remove('open'));
    if (!isOpen) dropdown.classList.add('open');
    return;
  }
  if (!e.target.closest('.BOA-nav-dropdown')) {
    document.querySelectorAll('.BOA-nav-dropdown.open').forEach(d => d.classList.remove('open'));
  }
});

/* ================================================================
   MODAL HELPERS
   ================================================================ */
function openModal(id) {
  const el = document.getElementById(id);
  if (el) { el.classList.add('open'); document.body.style.overflow = 'hidden'; }
}

function closeModal(id) {
  const el = document.getElementById(id);
  if (el) { el.classList.remove('open'); document.body.style.overflow = ''; }
}

document.addEventListener('click', function (e) {
  if (e.target.classList.contains('BOA-modal-overlay')) {
    e.target.classList.remove('open');
    document.body.style.overflow = '';
  }
  const closeBtn = e.target.closest('.BOA-modal__close');
  if (closeBtn) {
    const overlay = closeBtn.closest('.BOA-modal-overlay');
    if (overlay) { overlay.classList.remove('open'); document.body.style.overflow = ''; }
  }
});

/* ================================================================
   TOAST NOTIFICATIONS
   ================================================================ */
(function () {
  const container = document.createElement('div');
  container.id = 'BOA-toast-container';
  document.body.appendChild(container);
})();

function showToast(message, type = 'info', duration = 4000) {
  const icons = { success: 'fa-circle-check', error: 'fa-circle-xmark', warning: 'fa-triangle-exclamation', info: 'fa-circle-info' };
  const toast = document.createElement('div');
  toast.className = `BOA-toast BOA-toast--${type}`;
  toast.innerHTML = `<i class="fa ${icons[type] || icons.info}"></i><span>${message}</span>`;
  const container = document.getElementById('BOA-toast-container');
  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('removing');
    setTimeout(() => toast.remove(), 280);
  }, duration);
}

/* ================================================================
   HAMBURGER / MOBILE NAV
   ================================================================ */
document.addEventListener('DOMContentLoaded', function () {
  const hamburger = document.getElementById('BOA-hamburger');
  const mobileNav = document.getElementById('BOA-mobile-nav');
  if (!hamburger || !mobileNav) return;

  const overlay = mobileNav.querySelector('.BOA-mobile-nav__overlay');
  const closeBtn = mobileNav.querySelector('.BOA-mobile-nav__close');

  function openMobileNav() {
    mobileNav.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeMobileNav() {
    mobileNav.classList.remove('open');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', openMobileNav);
  if (overlay) overlay.addEventListener('click', closeMobileNav);
  if (closeBtn) closeBtn.addEventListener('click', closeMobileNav);

  // Close on nav link click
  mobileNav.querySelectorAll('.BOA-mobile-nav__link').forEach(link => {
    link.addEventListener('click', closeMobileNav);
  });
});

/* ================================================================
   NAVBAR AUTH STATE
   ================================================================ */
function updateNavbarAuth() {
  const isLogged = localStorage.getItem('token') === BOA_TOKEN;
  document.querySelectorAll('.BOA-nav--guest').forEach(el => el.style.display = isLogged ? 'none' : '');
  document.querySelectorAll('.BOA-nav--user').forEach(el => el.style.display = isLogged ? '' : 'none');

  // Mobile nav user section
  const mobileUser = document.getElementById('mobile-nav-user');
  const mobileGuest = document.getElementById('mobile-nav-guest');
  if (mobileUser) mobileUser.style.display = isLogged ? '' : 'none';
  if (mobileGuest) mobileGuest.style.display = isLogged ? 'none' : '';
}

document.addEventListener('DOMContentLoaded', updateNavbarAuth);

/* ================================================================
   ACTIVE NAV HIGHLIGHTING
   ================================================================ */
document.addEventListener('DOMContentLoaded', function () {
  const href = window.location.href;

  document.querySelectorAll('.BOA-subnav__item').forEach(function (li) {
    const a = li.querySelector('a, button');
    if (!a) return;
    const page = a.getAttribute('data-page') || '';
    if (page && href.indexOf(page) >= 0) li.classList.add('active');
  });

  document.querySelectorAll('.BOA-tab-nav__item').forEach(function (li) {
    const a = li.querySelector('a');
    if (!a) return;
    const pageName = (a.getAttribute('href') || '').split('/').pop().replace('.html', '');
    if (pageName && href.indexOf(pageName) >= 0) li.classList.add('active');
  });

  // Mobile nav active link
  const currentPage = window.location.pathname.split('/').pop();
  document.querySelectorAll('.BOA-mobile-nav__link[data-page]').forEach(link => {
    if (link.getAttribute('data-page') === currentPage) link.classList.add('active');
  });
});

/* ================================================================
   SESSION TIMEOUT
   Only active on protected banking pages.
   Warning at 2 min idle, logout at 0.
   ================================================================ */
(function () {
  const PROTECTED = ['account-activity.html','account-summary.html','money-map.html',
    'online-statements.html','pay-bills.html','transfer-funds.html','transfer-funds-verify.html'];
  const currentPage = window.location.pathname.split('/').pop();
  if (!PROTECTED.includes(currentPage)) return;
  if (localStorage.getItem('token') !== BOA_TOKEN) return;

  const IDLE_LIMIT   = 10 * 60 * 1000; // 10 min total idle
  const WARN_BEFORE  = 2  * 60 * 1000; // warn 2 min before
  const WARN_SECS    = 120;             // countdown seconds

  let idleTimer, warnTimer, countdownInterval;
  let countdownVal = WARN_SECS;

  const ring = document.getElementById('timeout-ring-fill');
  const countEl = document.getElementById('timeout-count');
  const CIRCUMFERENCE = 220;

  function setRing(secs) {
    const pct = secs / WARN_SECS;
    if (ring) ring.style.strokeDashoffset = CIRCUMFERENCE * (1 - pct);
    if (countEl) countEl.textContent = secs;
    // colour shift
    if (ring) ring.style.stroke = secs <= 30 ? 'var(--BOA-red)' : 'var(--BOA-amber)';
  }

  function startCountdown() {
    countdownVal = WARN_SECS;
    setRing(countdownVal);
    openModal('modal-session-timeout');
    countdownInterval = setInterval(() => {
      countdownVal--;
      setRing(countdownVal);
      if (countdownVal <= 0) {
        clearInterval(countdownInterval);
        doLogout();
      }
    }, 1000);
  }

  function doLogout() {
    closeModal('modal-session-timeout');
    localStorage.clear();
    window.location.href = '../../login.html?reason=timeout';
  }

  function resetTimers() {
    clearTimeout(idleTimer);
    clearTimeout(warnTimer);
    clearInterval(countdownInterval);
    // If warning modal is open and user interacted, close it
    const overlay = document.getElementById('modal-session-timeout');
    if (overlay && overlay.classList.contains('open')) {
      closeModal('modal-session-timeout');
    }
    warnTimer = setTimeout(startCountdown, IDLE_LIMIT - WARN_BEFORE);
    idleTimer = setTimeout(doLogout, IDLE_LIMIT);
  }

  ['mousemove','keydown','click','scroll','touchstart'].forEach(ev => {
    document.addEventListener(ev, resetTimers, { passive: true });
  });

  resetTimers();

  // "Stay signed in" button
  document.addEventListener('click', function (e) {
    if (e.target.id === 'btn-stay-signed-in') {
      clearInterval(countdownInterval);
      closeModal('modal-session-timeout');
      resetTimers();
      showToast('Session extended. Welcome back!', 'success');
    }
    if (e.target.id === 'btn-logout-now') {
      doLogout();
    }
  });
})();

/* ================================================================
   NOTIFICATIONS
   ================================================================ */
const BOA_NOTIFICATIONS = [
  { id: 1, icon: 'fa-right-left', iconClass: 'BOA-notif-item__icon--blue',  title: 'Transfer Received',       desc: '$2,400.00 direct deposit from PAYROLL',          time: '2 min ago',  unread: true  },
  { id: 2, icon: 'fa-shield-halved', iconClass: 'BOA-notif-item__icon--green', title: 'Security Alert',        desc: 'New sign-in from Chrome on Windows',             time: '1 hr ago',   unread: true  },
  { id: 3, icon: 'fa-triangle-exclamation', iconClass: 'BOA-notif-item__icon--amber', title: 'Low Balance Warning', desc: 'Savings account balance below $200',         time: '3 hrs ago',  unread: false },
  { id: 4, icon: 'fa-file-lines', iconClass: 'BOA-notif-item__icon--blue',   title: 'Statement Ready',         desc: 'Your October 2026 statement is available',       time: 'Yesterday',  unread: false },
  { id: 5, icon: 'fa-credit-card', iconClass: 'BOA-notif-item__icon--red',   title: 'Bill Due Soon',           desc: 'Electric bill of $145.00 due in 3 days',         time: '2 days ago', unread: false },
];

let notifications = [...BOA_NOTIFICATIONS];

function renderNotifications() {
  const list = document.getElementById('notif-list');
  const badge = document.getElementById('notif-badge');
  if (!list) return;

  const unread = notifications.filter(n => n.unread).length;
  if (badge) {
    badge.textContent = unread;
    badge.classList.toggle('hidden', unread === 0);
  }

  if (!notifications.length) {
    list.innerHTML = '<div class="BOA-notif-panel__empty"><i class="fa fa-bell-slash" style="font-size:1.5rem;opacity:.3;display:block;margin-bottom:.5rem"></i>No notifications</div>';
    return;
  }

  list.innerHTML = notifications.map(n => `
    <div class="BOA-notif-item ${n.unread ? 'unread' : ''}" data-id="${n.id}" onclick="markRead(${n.id})">
      <div class="BOA-notif-item__icon ${n.iconClass}"><i class="fa ${n.icon}"></i></div>
      <div class="BOA-notif-item__body">
        <div class="BOA-notif-item__title">${n.title}</div>
        <div class="BOA-notif-item__desc">${n.desc}</div>
        <div class="BOA-notif-item__time">${n.time}</div>
      </div>
      ${n.unread ? '<div style="width:8px;height:8px;border-radius:50%;background:var(--BOA-blue);flex-shrink:0;margin-top:.3rem"></div>' : ''}
    </div>`).join('');
}

function markRead(id) {
  notifications = notifications.map(n => n.id === id ? { ...n, unread: false } : n);
  renderNotifications();
}

function clearAllNotifications() {
  notifications = notifications.map(n => ({ ...n, unread: false }));
  renderNotifications();
}

document.addEventListener('DOMContentLoaded', renderNotifications);
