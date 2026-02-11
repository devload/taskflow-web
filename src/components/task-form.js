import { createTask } from '../api.js';
import { validateTask } from 'taskflow-shared/validation';
import { PRIORITY } from 'taskflow-shared/constants';
import { refreshApp } from '../main.js';

export function initTaskForm() {
  const container = document.getElementById('task-form');
  let isOpen = false;

  function render() {
    container.innerHTML = `
      <button id="toggle-form" class="btn btn-primary btn-new-task">
        ${isOpen ? '− Cancel' : '+ New Task'}
      </button>
      ${isOpen ? `
        <div class="card task-form-card">
          <h3>Create Task</h3>
          <form id="create-task-form">
            <div class="form-group">
              <label for="task-title">Title <span class="required">*</span></label>
              <input type="text" id="task-title" name="title" placeholder="Task title" required />
              <span class="field-error" id="title-error"></span>
            </div>
            <div class="form-group">
              <label for="task-description">Description</label>
              <textarea id="task-description" name="description" placeholder="Describe the task..." rows="3"></textarea>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="task-priority">Priority</label>
                <select id="task-priority" name="priority">
                  ${Object.entries(PRIORITY || {}).map(([key, value]) =>
                    `<option value="${value}">${key}</option>`
                  ).join('')}
                </select>
              </div>
              <div class="form-group">
                <label for="task-assignee">Assignee</label>
                <input type="email" id="task-assignee" name="assignee" placeholder="email@example.com" />
              </div>
            </div>
            <div id="form-error" class="error-message" style="display: none;"></div>
            <button type="submit" class="btn btn-primary">Create Task</button>
          </form>
        </div>
      ` : ''}
    `;

    document.getElementById('toggle-form').addEventListener('click', () => {
      isOpen = !isOpen;
      render();
    });

    if (isOpen) {
      document.getElementById('create-task-form').addEventListener('submit', handleSubmit);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errorEl = document.getElementById('form-error');
    const titleError = document.getElementById('title-error');
    errorEl.style.display = 'none';
    titleError.textContent = '';

    const data = {
      title: document.getElementById('task-title').value.trim(),
      description: document.getElementById('task-description').value.trim(),
      priority: document.getElementById('task-priority').value,
      assignee: document.getElementById('task-assignee').value.trim() || undefined,
    };

    const validation = validateTask(data);
    if (!validation.valid) {
      const errors = validation.errors || [];
      const titleErr = errors.find(e => e.field === 'title');
      if (titleErr) titleError.textContent = titleErr.message;
      const otherErrors = errors.filter(e => e.field !== 'title');
      if (otherErrors.length) {
        errorEl.textContent = otherErrors.map(e => e.message).join(', ');
        errorEl.style.display = 'block';
      }
      return;
    }

    try {
      await createTask(data);
      isOpen = false;
      render();
      refreshApp();
    } catch (err) {
      errorEl.textContent = err.message;
      errorEl.style.display = 'block';
    }
  }

  render();
}
