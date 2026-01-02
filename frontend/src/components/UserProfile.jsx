import React from 'react';

function UserProfile({ user, onLogout }) {
    return (
        <div className="user-profile">
            <div className="profile-info">
                <div className="profile-avatar">
                    {user?.username?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="profile-details">
                    <p className="profile-username">{user?.username}</p>
                    <p className="profile-email">{user?.email}</p>
                </div>
            </div>
            <button className="btn btn-danger" onClick={onLogout}>
                Logout
            </button>
        </div>
    );
}

export default UserProfile;
