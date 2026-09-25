/**
 * BOA Access Control
 * Guards protected banking pages using localStorage token.
 * Works from any directory depth.
 */
'use strict';

const VALID_TOKEN = 'd9fe4ef5-c5e7-4d17-9a37-ea8d21c019a6';

const PROTECTED_PAGES = [
  'account-activity.html',
  'account-summary.html',
  'money-map.html',
  'online-statements.html',
  'pay-bills.html',
  'transfer-funds-verify.html',
  'transfer-funds.html'
];

const checkAccess = () => {
  const token     = localStorage.getItem('token');
  const isLogged  = token === VALID_TOKEN;
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const isProtected = PROTECTED_PAGES.includes(currentPage);

  if (isLogged) {
    document.querySelectorAll('.BOA-nav--guest').forEach(el => el.style.display = 'none');
    document.querySelectorAll('.BOA-nav--user').forEach(el => el.style.display = '');
  } else if (isProtected) {
    localStorage.clear();
    // Calculate relative path back to root based on current depth
    const depth = window.location.pathname.split('/').filter(Boolean).length;
    // pages/bank/ = depth 2 from root (after www/BOA/)
    // Detect by checking if we're in a subdirectory
    const isSubdir = window.location.pathname.includes('/pages/');
    const loginPath = isSubdir ? '../../login.html' : './login.html';
    window.location.href = loginPath + '?redirectTo=' + encodeURIComponent(window.location.href);
  } else {
    document.querySelectorAll('.BOA-nav--user').forEach(el => el.style.display = 'none');
    document.querySelectorAll('.BOA-nav--guest').forEach(el => el.style.display = '');
  }
};

checkAccess();
