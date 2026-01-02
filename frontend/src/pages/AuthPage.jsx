import React, { useState } from 'react';
import { authAPI } from '../services/api';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import '../styles/auth.css';

function AuthPage({ onLogin }) {
    const [isLogin, setIsLogin] = useState(true);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLoginSubmit = async (email, password) => {
        setLoading(true);
        setError('');
        try {
            const response = await authAPI.login(email, password);
            onLogin(response.data.token, response.data.user);
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleRegisterSubmit = async (username, email, password) => {
        setLoading(true);
        setError('');
        try {
            const response = await authAPI.register(username, email, password);
            onLogin(response.data.token, response.data.user);
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h1>🚀 Bless Container</h1>
                <p className="subtitle">Task Management System</p>

                {error && <div className="error-message">{error}</div>}

                {isLogin ? (
                    <>
                        <LoginForm onSubmit={handleLoginSubmit} loading={loading} />
                        <p className="toggle-text">
                            Don't have an account?{' '}
                            <button
                                onClick={() => {
                                    setIsLogin(false);
                                    setError('');
                                }}
                                className="toggle-btn"
                            >
                                Register here
                            </button>
                        </p>
                    </>
                ) : (
                    <>
                        <RegisterForm onSubmit={handleRegisterSubmit} loading={loading} />
                        <p className="toggle-text">
                            Already have an account?{' '}
                            <button
                                onClick={() => {
                                    setIsLogin(true);
                                    setError('');
                                }}
                                className="toggle-btn"
                            >
                                Login here
                            </button>
                        </p>
                    </>
                )}
            </div>
        </div>
    );
}

export default AuthPage;
