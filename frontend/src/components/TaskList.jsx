import React from 'react';

function TaskList({ tasks, onEdit, onDelete, onStatusChange }) {
    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return '#10b981';
            case 'in-progress': return '#f59e0b';
            case 'pending': return '#6b7280';
            case 'cancelled': return '#ef4444';
            default: return '#6b7280';
        }
    };

    const getPriorityIcon = (priority) => {
        switch (priority) {
            case 'high': return '🔴';
            case 'medium': return '🟡';
            case 'low': return '🟢';
            default: return '⚪';
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <div className="task-list">
            {tasks.map((task) => (
                <div key={task.id} className="task-card">
                    <div className="task-header">
                        <div className="task-title-section">
                            <h3>{task.title}</h3>
                            <span className="priority-badge">
                                {getPriorityIcon(task.priority)} {task.priority}
                            </span>
                        </div>
                        <div className="task-actions">
                            <select
                                value={task.status}
                                onChange={(e) => onStatusChange(task.id, e.target.value)}
                                className="status-select"
                                style={{ color: getStatusColor(task.status) }}
                            >
                                <option value="pending">Pending</option>
                                <option value="in-progress">In Progress</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>
                    </div>

                    {task.description && (
                        <p className="task-description">{task.description}</p>
                    )}

                    <div className="task-footer">
                        <span className="task-date">
                            📅 {formatDate(task.created_at)}
                        </span>
                        <div className="task-buttons">
                            <button
                                className="btn btn-small btn-info"
                                onClick={() => onEdit(task)}
                            >
                                ✏️ Edit
                            </button>
                            <button
                                className="btn btn-small btn-danger"
                                onClick={() => onDelete(task.id)}
                            >
                                🗑️ Delete
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default TaskList;
