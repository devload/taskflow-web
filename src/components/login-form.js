import { login, register } from '../api.js';
import { setSession } from '../auth.js';

export function initLoginForm() {
  const container = document.getElementById('auth-section');
  let isRegisterMode = false;

  function render() {
    container.innerHTML = `
      <div class="auth-card card">
        <h2 class="auth-title">${isRegisterMode ? 'Create Account' : 'Sign In'}</h2>
        <form id="auth-form">
          ${isRegisterMode ? `
            <div class="form-group">
              <label for="name">Name</label>
              <input type="text" id="name" name="name" placeholder="Your name" required />
            </div>
          ` : ''}
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" name="email" placeholder="you@example.com" required />
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" name="password" placeholder="Password" required />
          </div>
          <div id="auth-error" class="error-message" style="display: none;"></div>
          <button type="submit" class="btn btn-primary btn-full">
            ${isRegisterMode ? 'Register' : 'Login'}
          </button>
        </form>
        <p class="auth-toggle">
          ${isRegisterMode ? 'Already have an account?' : "Don't have an account?"}
          <a href="#" id="toggle-auth">${isRegisterMode ? 'Sign In' : 'Register'}</a>
        </p>
      </div>
    `;

    document.getElementById('toggle-auth').addEventListener('click', (e) => {
      e.preventDefault();
      isRegisterMode = !isRegisterMode;
      render();
    });

    document.getElementById('auth-form').addEventListener('submit', handleSubmit);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errorEl = document.getElementById('auth-error');
    errorEl.style.display = 'none';

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
      let result;
      if (isRegisterMode) {
        const name = document.getElementById('name').value;
        result = await register(email, password, name);
      } else {
        result = await login(email, password);
      }

      setSession(result.token, result.user);
      window.location.reload();
    } catch (err) {
      errorEl.textContent = err.message;
      errorEl.style.display = 'block';
    }
  }

  render();
}
