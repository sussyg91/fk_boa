/**
 * BOA Logout
 * Clears session and redirects to home.
 */
(() => {
  localStorage.clear();
  window.location.href = './index.html';
})();
