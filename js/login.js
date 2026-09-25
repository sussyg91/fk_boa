/**
 * BOA Login Logic
 * Primary holder : Jimmy Bear
 * Joint holder   : Regina Bear
 * Credentials    : jimmyregina / jimmyregina2026
 */
'use strict';

const VALID_TOKEN = 'd9fe4ef5-c5e7-4d17-9a37-ea8d21c019a6';

const openPage = () => {
  const params     = new URLSearchParams(window.location.search);
  const redirectTo = params.get('redirectTo');
  window.location.href = redirectTo
    ? decodeURIComponent(redirectTo)
    : './pages/bank/account-summary.html';
};

const showError = (show, msg) => {
  const el = document.getElementById('login_error');
  if (!el) return;
  el.style.display = show ? 'flex' : 'none';
  if (msg) {
    const body = el.querySelector('.BOA-alert__body');
    if (body) body.innerHTML = msg;
  }
};

const checkPassword = () => {
  const usernameEl = document.getElementById('user_login');
  const passwordEl = document.getElementById('user_password');
  if (!usernameEl || !passwordEl) return;

  const username = usernameEl.value.trim();
  const password = passwordEl.value;

  if (!username || !password) {
    showError(true, '<div class="BOA-alert__title">Missing credentials</div>Please enter your User ID and Password.');
    return;
  }

  const isValid = username === 'jimmyregina' && password === 'jimmyregina2026';

  if (isValid) {
    localStorage.setItem('token', VALID_TOKEN);
    localStorage.setItem('loginTime', Date.now().toString());
    // Store profile so every page can read it without re-importing data.js
    localStorage.setItem('boa_displayName',  'Jimmy & Regina Bear');
    localStorage.setItem('boa_firstName',    'Jimmy');
    localStorage.setItem('boa_jointName',    'Regina');
    localStorage.setItem('boa_email',        'thegeniebear@gmail.com');
    localStorage.setItem('boa_phone',        '+1 (319) 240-2515');
    localStorage.setItem('boa_customerId',   'BOA-JR-00482156');
    showError(false);
    openPage();
  } else {
    usernameEl.value = '';
    passwordEl.value = '';
    localStorage.clear();
    showError(true, '<div class="BOA-alert__title">Sign-in failed</div>The User ID or Password you entered is incorrect. Please try again.');
    usernameEl.focus();
  }
};

document.getElementById('login_form')?.addEventListener('submit', function (e) {
  e.preventDefault();
  checkPassword();
});

// Pre-fill demo hint in help page link, and handle timeout redirect
document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  if (params.get('reason') === 'timeout') {
    showError(true, '<div class="BOA-alert__title">Session expired</div>You were signed out due to inactivity. Please sign in again.');
    const el = document.getElementById('login_error');
    if (el) el.className = 'BOA-alert BOA-alert--warning';
  }
});
