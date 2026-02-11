import { isLoggedIn, getUser, logout } from './auth.js';
import { initTaskList } from './components/task-list.js';
import { initTaskForm } from './components/task-form.js';
import { initLoginForm } from './components/login-form.js';

function showApp() {
  document.getElementById('auth-section').style.display = 'none';
  document.getElementById('app-section').style.display = 'block';

  const user = getUser();
  if (user) {
    document.getElementById('user-name').textContent = user.name || user.email;
  }

  document.getElementById('logout-btn').addEventListener('click', logout);

  initTaskForm();
  initTaskList();
}

function showAuth() {
  document.getElementById('auth-section').style.display = 'block';
  document.getElementById('app-section').style.display = 'none';
  initLoginForm();
}

export function refreshApp() {
  initTaskList();
}

document.addEventListener('DOMContentLoaded', () => {
  if (isLoggedIn()) {
    showApp();
  } else {
    showAuth();
  }
});
