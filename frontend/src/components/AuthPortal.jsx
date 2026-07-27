import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function AuthPortal() {
    const navigate = useNavigate();
    const [viewMode, setViewMode] = useState('login'); // 'login' | 'register' | 'forgot' | 'reset'
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [alert, setAlert] = useState({ type: '', text: '' });

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        phoneNumber: '',
        address: '',
        resetToken: '',
        newPassword: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Helper to decode JWT token and extract the user's role
    const getRoleFromToken = (token) => {
        try {
            if (!token || typeof token !== 'string') return 'RESIDENT';
            const payloadBase64 = token.split('.')[1];
            if (!payloadBase64) return 'RESIDENT';
            const decodedPayload = JSON.parse(atob(payloadBase64));
            return (decodedPayload.role || decodedPayload.roles || decodedPayload.authorities || 'RESIDENT').toString().toUpperCase();
        } catch (e) {
            console.error('Error decoding JWT token:', e);
            return 'RESIDENT';
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setAlert({ type: '', text: '' });

        try {
            if (viewMode === 'login') {
                const response = await axios.post('http://localhost:8081/api/auth/login', {
                    email: formData.email,
                    password: formData.password
                }, {
                    headers: { 'Content-Type': 'application/json' }
                });

                const apiResponse = response.data;
                const responseData = apiResponse.data || apiResponse;
                const token = responseData.token || apiResponse.token;

                if (token) {
                    localStorage.setItem('token', token);

                    // Extract user metadata from response.data based on backend structure
                    if (responseData.userId) localStorage.setItem('userId', responseData.userId);
                    if (responseData.firstName) localStorage.setItem('firstName', responseData.firstName);
                    if (responseData.lastName) localStorage.setItem('lastName', responseData.lastName);

                    // Fallback structured user object for components checking it
                    if (responseData.firstName) {
                        localStorage.setItem('user', JSON.stringify({
                            firstName: responseData.firstName,
                            lastName: responseData.lastName,
                            userId: responseData.userId
                        }));
                    }

                    const role = getRoleFromToken(token);

                    if (role.includes('ADMIN') || role.includes('MUNICIPAL')) {
                        navigate('/admin');
                    } else if (role.includes('TECH') || role.includes('TECHNICIAN')) {
                        navigate('/technician');
                    } else {
                        navigate('/resident');
                    }
                } else {
                    setAlert({ type: 'error', text: 'Login successful, but token was missing.' });
                }
            } else if (viewMode === 'register') {
                const response = await axios.post('http://localhost:8081/api/auth/register', {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    password: formData.password,
                    phoneNumber: formData.phoneNumber,
                    address: formData.address
                }, {
                    headers: { 'Content-Type': 'application/json' }
                });

                const apiResponse = response.data;
                setAlert({
                    type: 'success',
                    text: apiResponse.message || 'Account created successfully! Please sign in.'
                });
                setFormData({ firstName: '', lastName: '', email: '', password: '', phoneNumber: '', address: '', resetToken: '', newPassword: '' });
                setViewMode('login');
            } else if (viewMode === 'forgot') {
                const response = await axios.post('http://localhost:8081/api/auth/forgot-password', {
                    email: formData.email
                }, {
                    headers: { 'Content-Type': 'application/json' }
                });

                const apiResponse = response.data;
                setAlert({
                    type: 'success',
                    text: apiResponse.message || 'If the email exists, a password reset link has been generated.'
                });
            } else if (viewMode === 'reset') {
                const response = await axios.post('http://localhost:8081/api/auth/reset-password', {
                    token: formData.resetToken,
                    newPassword: formData.newPassword
                }, {
                    headers: { 'Content-Type': 'application/json' }
                });

                const apiResponse = response.data;
                setAlert({
                    type: 'success',
                    text: apiResponse.message || 'Password reset successfully.'
                });
                setTimeout(() => {
                    setViewMode('login');
                    setAlert({ type: '', text: '' });
                }, 3000);
            }
        } catch (error) {
            console.error(error);
            const serverMessage = error.response?.data?.message || error.response?.data;
            setAlert({
                type: 'error',
                text: typeof serverMessage === 'string' ? serverMessage : (error.response?.status === 401
                    ? 'Invalid credentials or expired session.'
                    : 'An unexpected connection error occurred.')
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.tabGroup}>
                    <button
                        type="button"
                        onClick={() => { setViewMode('login'); setAlert({type:'', text:''}); setShowPassword(false); }}
                        style={{ ...styles.tab, borderBottom: viewMode === 'login' ? '3px solid #007bff' : '3px solid transparent', color: viewMode === 'login' ? '#007bff' : '#666' }}
                    >
                        Sign In
                    </button>
                    <button
                        type="button"
                        onClick={() => { setViewMode('register'); setAlert({type:'', text:''}); setShowPassword(false); }}
                        style={{ ...styles.tab, borderBottom: viewMode === 'register' ? '3px solid #007bff' : '3px solid transparent', color: viewMode === 'register' ? '#007bff' : '#666' }}
                    >
                        Register
                    </button>
                </div>

                {alert.text && (
                    <div style={{ ...styles.alert, backgroundColor: alert.type === 'success' ? '#e6f4ea' : '#fce8e6', color: alert.type === 'success' ? '#137333' : '#c5221f' }}>
                        {alert.text}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {viewMode === 'register' && (
                        <div style={styles.row}>
                            <div style={{ ...styles.inputGroup, flex: 1, marginRight: '10px' }}>
                                <label style={styles.label}>First Name</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    placeholder="John"
                                    required
                                    style={styles.input}
                                />
                            </div>
                            <div style={{ ...styles.inputGroup, flex: 1 }}>
                                <label style={styles.label}>Last Name</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    placeholder="Tester"
                                    required
                                    style={styles.input}
                                />
                            </div>
                        </div>
                    )}

                    {(viewMode === 'login' || viewMode === 'register' || viewMode === 'forgot') && (
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Email Address</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="resident@example.com"
                                required
                                style={styles.input}
                            />
                        </div>
                    )}

                    {viewMode === 'login' && (
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Password</label>
                            <div style={styles.passwordWrapper}>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    required
                                    style={styles.passwordInput}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={styles.iconButton}
                                    title={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? 'Hide' : 'Show'}
                                </button>
                            </div>
                            <div style={{ textAlign: 'right', marginTop: '6px' }}>
                                <button
                                    type="button"
                                    onClick={() => { setViewMode('forgot'); setAlert({ type: '', text: '' }); }}
                                    style={styles.linkButton}
                                >
                                    Forgot password?
                                </button>
                            </div>
                        </div>
                    )}

                    {viewMode === 'register' && (
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Password (min 8 characters)</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                required
                                minLength={8}
                                style={styles.input}
                            />
                        </div>
                    )}

                    {viewMode === 'reset' && (
                        <>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Reset Token (from email)</label>
                                <input
                                    type="text"
                                    name="resetToken"
                                    value={formData.resetToken}
                                    onChange={handleChange}
                                    placeholder="Paste token here"
                                    required
                                    style={styles.input}
                                />
                            </div>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>New Password (min 8 characters)</label>
                                <input
                                    type="password"
                                    name="newPassword"
                                    value={formData.newPassword}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    required
                                    minLength={8}
                                    style={styles.input}
                                />
                            </div>
                        </>
                    )}

                    {viewMode === 'register' && (
                        <>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Phone Number</label>
                                <input
                                    type="tel"
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    placeholder="+27123456789"
                                    required
                                    style={styles.input}
                                />
                            </div>

                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Address</label>
                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    placeholder="123 Waterworks Street, Suburb"
                                    required
                                    rows="2"
                                    style={{ ...styles.input, resize: 'vertical' }}
                                />
                            </div>
                        </>
                    )}

                    <button type="submit" disabled={loading} style={styles.submitButton}>
                        {loading ? 'Please wait...' : viewMode === 'login' ? 'Sign In' : viewMode === 'register' ? 'Create Account' : viewMode === 'forgot' ? 'Send Reset Token' : 'Reset Password'}
                    </button>

                    {(viewMode === 'forgot' || viewMode === 'reset') && (
                        <div style={{ textAlign: 'center', marginTop: '15px' }}>
                            <button
                                type="button"
                                onClick={() => { setViewMode('login'); setAlert({ type: '', text: '' }); }}
                                style={styles.linkButton}
                            >
                                ← Back to Sign In
                            </button>
                            {viewMode === 'forgot' && (
                                <div style={{ marginTop: '8px' }}>
                                    <button
                                        type="button"
                                        onClick={() => { setViewMode('reset'); setAlert({ type: '', text: '' }); }}
                                        style={styles.linkButton}
                                    >
                                        Already have a reset token? Enter it here
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f4f6f9',
        fontFamily: 'Segoe UI, Roboto, Helvetica, Arial, sans-serif'
    },
    card: {
        backgroundColor: '#ffffff',
        padding: '35px',
        borderRadius: '8px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
        width: '100%',
        maxWidth: '440px',
        boxSizing: 'border-box'
    },
    tabGroup: {
        display: 'flex',
        marginBottom: '25px',
        borderBottom: '1px solid #eee'
    },
    tab: {
        flex: 1,
        padding: '12px',
        background: 'none',
        border: 'none',
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'pointer',
        outline: 'none'
    },
    row: {
        display: 'flex',
        justifyContent: 'space-between'
    },
    inputGroup: {
        marginBottom: '16px'
    },
    label: {
        display: 'block',
        marginBottom: '6px',
        fontSize: '13px',
        fontWeight: '600',
        color: '#4e5d6c'
    },
    input: {
        width: '100%',
        padding: '10px 12px',
        fontSize: '14px',
        borderRadius: '4px',
        border: '1px solid #ccd4db',
        boxSizing: 'border-box',
        outline: 'none',
        color: '#333333',
        backgroundColor: '#ffffff'
    },
    passwordWrapper: {
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        width: '100%'
    },
    passwordInput: {
        width: '100%',
        padding: '10px 40px 10px 12px',
        fontSize: '14px',
        borderRadius: '4px',
        border: '1px solid #ccd4db',
        boxSizing: 'border-box',
        outline: 'none',
        color: '#333333',
        backgroundColor: '#ffffff'
    },
    iconButton: {
        position: 'absolute',
        right: '10px',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4px',
        outline: 'none',
        color: '#007bff',
        fontWeight: 'bold',
        fontSize: '12px'
    },
    submitButton: {
        width: '100%',
        padding: '12px',
        backgroundColor: '#007bff',
        color: '#ffffff',
        border: 'none',
        borderRadius: '4px',
        fontSize: '15px',
        fontWeight: 'bold',
        cursor: 'pointer',
        marginTop: '10px'
    },
    linkButton: {
        background: 'none',
        border: 'none',
        color: '#007bff',
        cursor: 'pointer',
        fontSize: '13px',
        fontWeight: '500',
        padding: 0,
        textDecoration: 'underline'
    },
    alert: {
        padding: '12px',
        borderRadius: '4px',
        marginBottom: '20px',
        fontSize: '14px',
        textAlign: 'center',
        fontWeight: '500'
    }
};