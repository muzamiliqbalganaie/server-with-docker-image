import React from 'react';

function SearchBar({ value, onChange }) {
    return (
        <div className="search-bar">
            <input
                type="text"
                placeholder="🔍 Search tasks..."
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="search-input"
            />
            {value && (
                <button
                    className="clear-search"
                    onClick={() => onChange('')}
                    title="Clear search"
                >
                    ✕
                </button>
            )}
        </div>
    );
}

export default SearchBar;
