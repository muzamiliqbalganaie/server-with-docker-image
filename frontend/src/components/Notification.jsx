import React, { useEffect } from 'react';

function Notification({ message, type, onClose }) {
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                onClose();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [message, onClose]);

    if (!message) return null;

    return (
        <div className={`notification-popup ${type}`}>
            <div className="notification-content">
                <span className="notification-icon">
                    {type === 'error' ? '❌' : '✅'}
                </span>
                <span className="notification-message">{message}</span>
                <button className="notification-close" onClick={onClose}>
                    ✕
                </button>
            </div>
        </div>
    );
}

export default Notification;
