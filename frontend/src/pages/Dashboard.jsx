import React, { useState, useEffect } from 'react';
import { userAPI, taskAPI } from '../services/api';
import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';
import UserProfile from '../components/UserProfile';
import TaskStats from '../components/TaskStats';
import SearchBar from '../components/SearchBar';
import ThemeToggle from '../components/ThemeToggle';
import AnimatedCube from '../components/AnimatedCube';
import ProgressRing from '../components/ProgressRing';
import Notification from '../components/Notification';
import '../styles/dashboard.css';

function Dashboard({ user, onLogout }) {
    const [tasks, setTasks] = useState([]);
    const [filteredTasks, setFilteredTasks] = useState([]);
    const [profile, setProfile] = useState(user);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [showTaskForm, setShowTaskForm] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [isDarkMode, setIsDarkMode] = useState(() => {
        return localStorage.getItem('darkMode') === 'true';
    });

    // Fetch tasks on mount
    useEffect(() => {
        fetchTasks();
        fetchProfile();
    }, [filterStatus]);

    // Apply dark mode
    useEffect(() => {
        if (isDarkMode) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
        localStorage.setItem('darkMode', isDarkMode);
    }, [isDarkMode]);

    // Filter and search tasks
    useEffect(() => {
        let result = tasks;

        // Apply search
        if (searchQuery) {
            result = result.filter(task =>
                task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                task.description?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        setFilteredTasks(result);
    }, [tasks, searchQuery]);

    const fetchTasks = async () => {
        setLoading(true);
        try {
            const response = await taskAPI.getTasks(filterStatus, '');
            setTasks(response.data.tasks);
            setError('');
        } catch (err) {
            setError('Failed to load tasks');
        } finally {
            setLoading(false);
        }
    };

    const fetchProfile = async () => {
        try {
            const response = await userAPI.getProfile();
            setProfile(response.data.user);
        } catch (err) {
            console.error('Failed to fetch profile');
        }
    };

    const handleCreateTask = async (title, description, priority) => {
        try {
            await taskAPI.createTask(title, description, priority);
            setSuccess('Task created successfully!');
            setShowTaskForm(false);
            fetchTasks();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError('Failed to create task');
        }
    };

    const handleUpdateTask = async (id, updates) => {
        try {
            await taskAPI.updateTask(id, updates);
            setSuccess('Task updated successfully!');
            setEditingTask(null);
            fetchTasks();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError('Failed to update task');
        }
    };

    const handleDeleteTask = async (id) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            try {
                await taskAPI.deleteTask(id);
                setSuccess('Task deleted successfully!');
                fetchTasks();
                setTimeout(() => setSuccess(''), 3000);
            } catch (err) {
                setError('Failed to delete task');
            }
        }
    };

    const handleLogout = () => {
        if (window.confirm('Are you sure you want to logout?')) {
            onLogout();
        }
    };

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
    };

    return (
        <div className="dashboard">
            <Notification
                message={error}
                type="error"
                onClose={() => setError('')}
            />
            <Notification
                message={success}
                type="success"
                onClose={() => setSuccess('')}
            />

            <header className="dashboard-header">
                <div className="header-content">
                    <h1>📋 Task Manager</h1>
                    <div className="header-actions">
                        <ThemeToggle isDark={isDarkMode} onToggle={toggleTheme} />
                        <UserProfile user={profile} onLogout={handleLogout} />
                    </div>
                </div>
            </header>

            <div className="dashboard-container">

                <div className="sidebar s">
                    <div className="filter-section">
                        <h3>Filters</h3>
                        <div className="filter-group">
                            <label>Status:</label>
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="filter-select"
                            >
                                <option value="">All</option>
                                <option value="pending">Pending</option>
                                <option value="in-progress">In Progress</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>

                        <button
                            className="btn btn-primary btn-block"
                            onClick={() => {
                                setShowTaskForm(true);
                                setEditingTask(null);
                            }}
                        >
                            ➕ New Task
                        </button>
                    </div>
                    <TaskStats tasks={tasks} />
                    <ProgressRing completionRate={tasks.length > 0 ? Math.round((tasks.filter(t => t.status === 'completed').length / tasks.length) * 100) : 0} />

                    <AnimatedCube stats={{ completionRate: tasks.length > 0 ? Math.round((tasks.filter(t => t.status === 'completed').length / tasks.length) * 100) : 0 }} />



                </div>

                <div className="main-content">
                    <SearchBar value={searchQuery} onChange={setSearchQuery} />
                    {showTaskForm && (
                        <div className="modal-overlay">
                            <div className="modal">
                                <div className="modal-header">
                                    <h2>{editingTask ? 'Edit Task' : 'Create New Task'}</h2>
                                    <button
                                        className="close-btn"
                                        onClick={() => {
                                            setShowTaskForm(false);
                                            setEditingTask(null);
                                        }}
                                    >
                                        ✕
                                    </button>
                                </div>
                                <TaskForm
                                    onSubmit={editingTask ?
                                        (data) => handleUpdateTask(editingTask.id, data) :
                                        (title, desc, priority) => handleCreateTask(title, desc, priority)
                                    }
                                    initialData={editingTask}
                                    onCancel={() => {
                                        setShowTaskForm(false);
                                        setEditingTask(null);
                                    }}
                                />
                            </div>
                        </div>
                    )}

                    {loading ? (
                        <div className="loading">Loading tasks...</div>
                    ) : filteredTasks.length === 0 ? (
                        <div className="empty-state">
                            <p>📭 {searchQuery ? 'No tasks match your search.' : 'No tasks found. Create one to get started!'}</p>
                        </div>
                    ) : (
                        <TaskList
                            tasks={filteredTasks}
                            onEdit={(task) => {
                                setEditingTask(task);
                                setShowTaskForm(true);
                            }}
                            onDelete={handleDeleteTask}
                            onStatusChange={(id, status) => handleUpdateTask(id, { status })}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;