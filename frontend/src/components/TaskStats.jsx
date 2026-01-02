import React from 'react';

function TaskStats({ tasks }) {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'completed').length;
    const inProgressTasks = tasks.filter(t => t.status === 'in-progress').length;
    const pendingTasks = tasks.filter(t => t.status === 'pending').length;
    const highPriorityTasks = tasks.filter(t => t.priority === 'high').length;

    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return (
        <div className="stats-container">
            <h3>📊 Task Statistics</h3>

            <div className="stats-grid">
                <div className="stat-card stat-total">
                    <div className="stat-icon">📋</div>
                    <div className="stat-content">
                        <div className="stat-value">{totalTasks}</div>
                        <div className="stat-label">Total Tasks</div>
                    </div>
                </div>

                <div className="stat-card stat-completed">
                    <div className="stat-icon">✅</div>
                    <div className="stat-content">
                        <div className="stat-value">{completedTasks}</div>
                        <div className="stat-label">Completed</div>
                    </div>
                </div>

                <div className="stat-card stat-progress">
                    <div className="stat-icon">⚡</div>
                    <div className="stat-content">
                        <div className="stat-value">{inProgressTasks}</div>
                        <div className="stat-label">In Progress</div>
                    </div>
                </div>

                <div className="stat-card stat-pending">
                    <div className="stat-icon">⏳</div>
                    <div className="stat-content">
                        <div className="stat-value">{pendingTasks}</div>
                        <div className="stat-label">Pending</div>
                    </div>
                </div>
            </div>

            <div className="completion-rate">
                <div className="rate-header">
                    <span>Completion Rate</span>
                    <span className="rate-percentage">{completionRate}%</span>
                </div>
                <div className="progress-bar">
                    <div
                        className="progress-fill"
                        style={{ width: `${completionRate}%` }}
                    ></div>
                </div>
            </div>

            {highPriorityTasks > 0 && (
                <div className="priority-alert">
                    🔴 {highPriorityTasks} high priority task{highPriorityTasks !== 1 ? 's' : ''} need{highPriorityTasks === 1 ? 's' : ''} attention
                </div>
            )}
        </div>
    );
}

export default TaskStats;
