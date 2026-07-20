import React, { useState } from 'react';
import axios from 'axios';

export default function AuthPortal() {
    const [isLoginView, setIsLoginView] = useState(true);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
    const [alert, setAlert] = useState({ type: '', text: '' });

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        phoneNumber: '',
        address: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setAlert({ type: '', text: '' });

        const endpoint = isLoginView ? '/login' : '/register';
        const payload = isLoginView
            ? { email: formData.email, password: formData.password }
            : formData;

        try {
            const response = await axios.post(`http://localhost:8081/api/auth${endpoint}`, payload, {
                headers: { 'Content-Type': 'application/json' }
            });

            const apiResponse = response.data;

            setAlert({
                type: 'success',
                text: apiResponse.message || (isLoginView ? 'Login successful!' : 'Account created successfully!')
            });

            if (isLoginView) {
                if (apiResponse.data?.token) {
                    localStorage.setItem('token', apiResponse.data.token);
                }
            } else {
                setFormData({ firstName: '', lastName: '', email: '', password: '', phoneNumber: '', address: '' });
                setIsLoginView(true);
            }
        } catch (error) {
            console.error(error);
            const serverMessage = error.response?.data?.message;
            setAlert({
                type: 'error',
                text: serverMessage || 'An unexpected connection error occurred.'
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
                        onClick={() => { setIsLoginView(true); setAlert({type:'', text:''}); setShowPassword(false); }}
                        style={{ ...styles.tab, borderBottom: isLoginView ? '3px solid #007bff' : '3px solid transparent', color: isLoginView ? '#007bff' : '#666' }}
                    >
                        Sign In
                    </button>
                    <button
                        type="button"
                        onClick={() => { setIsLoginView(false); setAlert({type:'', text:''}); setShowPassword(false); }}
                        style={{ ...styles.tab, borderBottom: !isLoginView ? '3px solid #007bff' : '3px solid transparent', color: !isLoginView ? '#007bff' : '#666' }}
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
                    {/* REGISTRATION ONLY FIELDS */}
                    {!isLoginView && (
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

                    {/* SHARED FIELDS */}
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Email Address</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="customer@foodapp.com"
                            required
                            style={styles.input}
                        />
                    </div>

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
                                {showPassword ? (
                                    /* Eye Hidden SVG icon */
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#777" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                                        <line x1="1" y1="1" x2="23" y2="23"></line>
                                    </svg>
                                ) : (
                                    /* Eye Open SVG icon */
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#777" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                        <circle cx="12" cy="12" r="3"></circle>
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* REGISTRATION ONLY FIELDS */}
                    {!isLoginView && (
                        <>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Phone Number</label>
                                <input
                                    type="tel"
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    placeholder="+1234567890"
                                    required
                                    style={styles.input}
                                />
                            </div>

                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Delivery Address</label>
                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    placeholder="123 Main Street, Appetizer City"
                                    required
                                    rows="2"
                                    style={{ ...styles.input, resize: 'vertical' }}
                                />
                            </div>
                        </>
                    )}

                    <button type="submit" disabled={loading} style={styles.submitButton}>
                        {loading ? 'Please wait...' : isLoginView ? 'Sign In' : 'Create Account'}
                    </button>
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
        color: '#ffffff'
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
        color: '#ffffff'
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
        outline: 'none'
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
    alert: {
        padding: '12px',
        borderRadius: '4px',
        marginBottom: '20px',
        fontSize: '14px',
        textAlign: 'center',
        fontWeight: '500'
    }
};