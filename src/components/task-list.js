import { getTasks, updateTask, deleteTask } from '../api.js';
import { TASK_STATUS, PRIORITY_LABELS, STATUS_TRANSITIONS } from 'taskflow-shared/constants';

const STATUS_COLORS = {
  todo: 'badge-gray',
  in_progress: 'badge-blue',
  review: 'badge-amber',
  done: 'badge-green',
};

const PRIORITY_COLORS = {
  low: 'badge-gray',
  medium: 'badge-blue',
  high: 'badge-amber',
  urgent: 'badge-red',
};

let currentFilter = null;

export async function initTaskList() {
  const container = document.getElementById('task-list');

  try {
    const filters = currentFilter ? { status: currentFilter } : {};
    const response = await getTasks(filters);
    const tasks = response.tasks || response || [];

    container.innerHTML = `
      <div class="task-filters">
        <button class="btn btn-filter ${!currentFilter ? 'active' : ''}" data-filter="">All</button>
        ${Object.entries(TASK_STATUS).map(([key, value]) => `
          <button class="btn btn-filter ${currentFilter === value ? 'active' : ''}" data-filter="${value}">
            ${key.replace(/_/g, ' ')}
          </button>
        `).join('')}
      </div>

      <div class="task-cards">
        ${tasks.length === 0 ? '<p class="empty-state">No tasks found. Create one to get started!</p>' : ''}
        ${tasks.map(task => renderTaskCard(task)).join('')}
      </div>
    `;

    container.querySelectorAll('.btn-filter').forEach(btn => {
      btn.addEventListener('click', () => {
        currentFilter = btn.dataset.filter || null;
        initTaskList();
      });
    });

    container.querySelectorAll('.task-card').forEach(card => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('.task-actions')) return;
        card.classList.toggle('expanded');
      });
    });

    container.querySelectorAll('.status-select').forEach(select => {
      select.addEventListener('change', async (e) => {
        const taskId = e.target.dataset.taskId;
        const newStatus = e.target.value;
        try {
          await updateTask(taskId, { status: newStatus });
          initTaskList();
        } catch (err) {
          alert(`Failed to update status: ${err.message}`);
        }
      });
    });

    container.querySelectorAll('.btn-delete').forEach(btn => {
      btn.addEventListener('click', async () => {
        if (!confirm('Delete this task?')) return;
        try {
          await deleteTask(btn.dataset.taskId);
          initTaskList();
        } catch (err) {
          alert(`Failed to delete: ${err.message}`);
        }
      });
    });
  } catch (err) {
    container.innerHTML = `<p class="error-message">Failed to load tasks: ${err.message}</p>`;
  }
}

function renderTaskCard(task) {
  const statusColor = STATUS_COLORS[task.status] || 'badge-gray';
  const priorityColor = PRIORITY_COLORS[task.priority] || 'badge-gray';
  const priorityLabel = PRIORITY_LABELS?.[task.priority] || task.priority || 'none';
  const transitions = STATUS_TRANSITIONS?.[task.status] || [];

  return `
    <div class="task-card card" data-id="${task.id}">
      <div class="task-card-header">
        <h3 class="task-title">${escapeHtml(task.title)}</h3>
        <div class="task-badges">
          <span class="badge ${statusColor}">${(task.status || 'todo').replace(/_/g, ' ')}</span>
          <span class="badge ${priorityColor}">${priorityLabel}</span>
        </div>
      </div>
      ${task.assignee ? `<p class="task-assignee">Assigned to: ${escapeHtml(task.assignee)}</p>` : ''}
      ${task.description ? `<p class="task-description">${escapeHtml(task.description).substring(0, 120)}${task.description.length > 120 ? '...' : ''}</p>` : ''}
      <div class="task-actions">
        ${transitions.length > 0 ? `
          <select class="status-select" data-task-id="${task.id}">
            <option value="${task.status}" selected>Move to...</option>
            ${transitions.map(s => `<option value="${s}">${s.replace(/_/g, ' ')}</option>`).join('')}
          </select>
        ` : ''}
        <button class="btn btn-sm btn-danger btn-delete" data-task-id="${task.id}">Delete</button>
      </div>
    </div>
  `;
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
