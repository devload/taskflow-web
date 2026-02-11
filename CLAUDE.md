# taskflow-web

Frontend for the TaskFlow application.

## Architecture
- Vanilla JavaScript with ES modules
- Vite for dev server and bundling
- No framework — plain DOM manipulation
- API calls proxied through Vite to taskflow-api

## File Structure
- `index.html` — SPA shell
- `src/main.js` — app initialization and routing
- `src/api.js` — API client (all HTTP calls)
- `src/auth.js` — session management, permission checks
- `src/components/` — UI components (task-list, task-form, login-form)
- `src/styles/main.css` — all styles

## Development
```bash
npm install
npm run dev     # starts Vite on :5173, proxies /api to :3001
npm run build   # production build to dist/
```

## Key Patterns
- Components export init functions that mount into DOM containers
- Auth state in localStorage (token + user JSON)
- Permission checks use `hasPermission()` from taskflow-shared
- Task validation uses `validateTask()` from taskflow-shared
- Status transitions enforced client-side via `STATUS_TRANSITIONS` from shared

## Proxy Configuration
Vite proxies `/api/*` to `http://localhost:3001/*` — the API server.
In production, configure reverse proxy accordingly.

## Dependencies
- `taskflow-shared` — shared constants, roles, validation
- `vite` — dev server and bundler (devDep)
