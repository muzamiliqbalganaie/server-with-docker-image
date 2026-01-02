import React from 'react';

function ThemeToggle({ isDark, onToggle }) {
    return (
        <button
            className="theme-toggle"
            onClick={onToggle}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
            {isDark ? '☀️' : '🌙'}
        </button>
    );
}

export default ThemeToggle;
