import { ROLES, hasPermission } from 'taskflow-shared/roles';

export function getToken() {
  return localStorage.getItem('token');
}

export function setSession(token, user) {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

export function getUser() {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

export function isLoggedIn() {
  return !!getToken();
}

export function checkPermission(action) {
  const user = getUser();
  if (!user || !user.role) return false;
  return hasPermission(user.role, action);
}

export function logout() {
  clearSession();
  window.location.reload();
}
