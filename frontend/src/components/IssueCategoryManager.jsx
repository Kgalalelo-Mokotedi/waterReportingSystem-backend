import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function IssueCategoryManager() {
    const [categories, setCategories] = useState([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState({ type: '', text: '' });

    const getAuthHeaders = () => ({
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });

    const fetchCategories = async () => {
        try {
            const res = await axios.get('http://localhost:8081/api/issue-categories', getAuthHeaders());
            if (res.data?.data) {
                setCategories(res.data.data);
            } else if (Array.isArray(res.data)) {
                setCategories(res.data);
            }
        } catch (err) {
            console.error("Failed to load issue categories", err);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleCreateCategory = async (e) => {
        e.preventDefault();
        setLoading(true);
        setAlert({ type: '', text: '' });

        try {
            await axios.post(
                'http://localhost:8081/api/issue-categories',
                { name, description },
                getAuthHeaders()
            );

            setAlert({ type: 'success', text: 'Issue category created successfully!' });
            setName('');
            setDescription('');
            fetchCategories();
        } catch (err) {
            console.error("Failed to create category", err);
            const serverMsg = err.response?.data?.message;
            setAlert({ type: 'error', text: serverMsg || 'Failed to create category.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <div style={styles.logo}>⚙️ Issue Category Manager</div>
            </header>

            <div style={styles.content}>
                {alert.text && (
                    <div style={{
                        ...styles.alert,
                        backgroundColor: alert.type === 'success' ? '#e6f4ea' : '#fce8e6',
                        color: alert.type === 'success' ? '#137333' : '#c5221f'
                    }}>
                        {alert.text}
                    </div>
                )}

                <div style={styles.grid}>
                    {/* Form to Add New Category */}
                    <div style={styles.panel}>
                        <h3>Add New Category</h3>
                        <form onSubmit={handleCreateCategory}>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Category Name</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g., Burst Pipe, Water Discoloration"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    style={styles.input}
                                />
                            </div>

                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Description</label>
                                <textarea
                                    rows="3"
                                    placeholder="Brief description of the issue category..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    style={{ ...styles.input, resize: 'vertical' }}
                                />
                            </div>

                            <button type="submit" disabled={loading} style={styles.button}>
                                {loading ? 'Saving...' : 'Add Category'}
                            </button>
                        </form>
                    </div>

                    {/* Category List View */}
                    <div style={styles.panel}>
                        <h3>Existing Categories</h3>
                        {categories.length === 0 ? (
                            <p style={{ color: '#666', fontStyle: 'italic' }}>No issue categories found.</p>
                        ) : (
                            <table style={styles.table}>
                                <thead>
                                <tr>
                                    <th style={styles.th}>ID</th>
                                    <th style={styles.th}>Name</th>
                                    <th style={styles.th}>Description</th>
                                </tr>
                                </thead>
                                <tbody>
                                {categories.map((cat) => (
                                    <tr key={cat.id}>
                                        <td style={styles.td}>#{cat.id}</td>
                                        <td style={styles.td}><strong>{cat.name}</strong></td>
                                        <td style={styles.td}>{cat.description || '—'}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: {
        minHeight: '100vh',
        backgroundColor: '#f4f6f9',
        fontFamily: 'Segoe UI, Roboto, Helvetica, Arial, sans-serif'
    },
    header: {
        backgroundColor: '#2e7d32',
        color: '#fff',
        padding: '15px 30px'
    },
    logo: {
        fontSize: '18px',
        fontWeight: 'bold'
    },
    content: {
        padding: '30px',
        maxWidth: '1000px',
        margin: '0 auto'
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '20px'
    },
    panel: {
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
    },
    inputGroup: {
        marginBottom: '15px'
    },
    label: {
        display: 'block',
        fontSize: '13px',
        fontWeight: '600',
        marginBottom: '5px',
        color: '#4e5d6c'
    },
    input: {
        width: '100%',
        padding: '10px',
        borderRadius: '4px',
        border: '1px solid #ccd4db',
        boxSizing: 'border-box'
    },
    button: {
        width: '100%',
        padding: '10px',
        backgroundColor: '#2e7d32',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        fontWeight: 'bold',
        cursor: 'pointer'
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        marginTop: '10px'
    },
    th: {
        textAlign: 'left',
        borderBottom: '2px solid #eee',
        padding: '8px',
        fontSize: '13px',
        color: '#666'
    },
    td: {
        borderBottom: '1px solid #eee',
        padding: '8px',
        fontSize: '14px'
    },
    alert: {
        padding: '12px',
        borderRadius: '4px',
        marginBottom: '20px',
        fontSize: '14px',
        fontWeight: '500'
    }
};