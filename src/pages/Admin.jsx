import React, { useState, useEffect } from 'react';
import { Upload, Download, Search, Edit2, Play, Pause, Save, LogOut, Lock } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;

// ─── Login Screen ───
function AdminLogin({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch(`${API_URL}/admin/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = await res.json();

            if (res.ok && data.token) {
                sessionStorage.setItem('adminToken', data.token);
                onLogin(data.token);
            } else {
                setError(data.error || 'Login failed');
            }
        } catch {
            setError('Server not reachable. Is the backend running?');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-login-wrapper">
            <div className="admin-login-card">
                <div className="admin-login-icon">
                    <Lock size={40} />
                </div>
                <h1 className="admin-login-title">Admin Portal</h1>
                <p className="admin-login-subtitle">Hack-O-Holic 4.0 — Leaderboard Control</p>

                <form onSubmit={handleSubmit} className="admin-login-form">
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        className="admin-input"
                        required
                        autoComplete="username"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="admin-input"
                        required
                        autoComplete="current-password"
                    />
                    {error && <p className="admin-login-error">{error}</p>}
                    <button type="submit" className="admin-login-btn" disabled={loading}>
                        {loading ? 'Verifying...' : 'Sign In'}
                    </button>
                </form>
            </div>
        </div>
    );
}

// ─── Admin Dashboard ───
function AdminDashboard({ token, onLogout }) {
    const [teams, setTeams] = useState([]);
    const [visibility, setVisibility] = useState(true);
    const [search, setSearch] = useState('');
    const [file, setFile] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [editPoints, setEditPoints] = useState(0);
    const [uploading, setUploading] = useState(false);

    const authHeaders = {
        'Authorization': `Bearer ${token}`
    };

    useEffect(() => {
        fetchTeams();
        fetchVisibility();
    }, []);

    const fetchTeams = async () => {
        try {
            const res = await fetch(`${API_URL}/leaderboard`);
            const data = await res.json();
            setTeams(data);
        } catch (err) {
            console.error('Failed to fetch teams:', err);
        }
    };

    const fetchVisibility = async () => {
        try {
            const res = await fetch(`${API_URL}/settings/visibility`);
            const data = await res.json();
            setVisibility(data.visibility);
        } catch (err) {
            console.error('Failed to fetch visibility:', err);
        }
    };

    const toggleVisibility = async () => {
        try {
            const newVisibility = !visibility;
            const res = await fetch(`${API_URL}/settings/visibility`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', ...authHeaders },
                body: JSON.stringify({ visibility: newVisibility })
            });
            if (res.ok) setVisibility(newVisibility);
            else if (res.status === 401 || res.status === 403) onLogout();
        } catch (err) {
            console.error(err);
        }
    };

    const handleFileUpload = async (e) => {
        e.preventDefault();
        if (!file) return alert('Please select a CSV file');
        setUploading(true);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch(`${API_URL}/csv/upload`, {
                method: 'POST',
                headers: { ...authHeaders },
                body: formData
            });
            if (res.ok) {
                alert('CSV Uploaded Successfully');
                fetchTeams();
                setFile(null);
            } else if (res.status === 401 || res.status === 403) {
                onLogout();
            } else {
                alert('Failed to upload CSV');
            }
        } catch (err) {
            console.error(err);
            alert('Failed to upload CSV');
        } finally {
            setUploading(false);
        }
    };

    const handleExport = async () => {
        try {
            const res = await fetch(`${API_URL}/csv/export`, {
                headers: { ...authHeaders }
            });
            if (res.status === 401 || res.status === 403) {
                onLogout();
                return;
            }
            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'leaderboard_export.csv';
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error(err);
        }
    };

    const savePoints = async (id) => {
        try {
            const res = await fetch(`${API_URL}/teams/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', ...authHeaders },
                body: JSON.stringify({ points: Number(editPoints) })
            });
            if (res.ok) {
                setEditingId(null);
                fetchTeams();
            } else if (res.status === 401 || res.status === 403) {
                onLogout();
            }
        } catch (err) {
            console.error(err);
        }
    };

    const filteredTeams = teams.filter(t =>
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.leader.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="admin-dashboard">
            {/* Header */}
            <header className="admin-header">
                <h2 className="admin-header-title">Leaderboard Admin</h2>
                <div className="admin-header-actions">
                    <button onClick={toggleVisibility} className={`admin-visibility-btn ${visibility ? 'on' : 'off'}`}>
                        {visibility ? <Pause size={18} /> : <Play size={18} />}
                        Leaderboard: {visibility ? 'ON' : 'OFF'}
                    </button>
                    <button onClick={onLogout} className="admin-logout-btn">
                        <LogOut size={18} /> Logout
                    </button>
                </div>
            </header>

            {/* CSV Actions */}
            <section className="admin-csv-section">
                <div className="admin-csv-import">
                    <h3>Import CSV</h3>
                    <p className="admin-csv-hint">Headers: "Team Name", "Leader Name", "Participant Names"</p>
                    <form onSubmit={handleFileUpload} className="admin-csv-form">
                        <input type="file" accept=".csv" onChange={(e) => setFile(e.target.files[0])} />
                        <button type="submit" className="admin-btn-primary" disabled={uploading}>
                            <Upload size={16} /> {uploading ? 'Uploading...' : 'Upload'}
                        </button>
                    </form>
                </div>
                <div className="admin-csv-export">
                    <h3>Export Data</h3>
                    <button onClick={handleExport} className="admin-btn-secondary">
                        <Download size={16} /> Download CSV
                    </button>
                </div>
            </section>

            {/* Team Management */}
            <section className="admin-teams-section">
                <div className="admin-teams-header">
                    <h3>Team Management ({teams.length})</h3>
                    <div className="admin-search-wrapper">
                        <Search size={18} className="admin-search-icon" />
                        <input
                            type="text"
                            placeholder="Search teams..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="admin-search-input"
                        />
                    </div>
                </div>

                <div className="admin-table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Team Name</th>
                                <th>Leader</th>
                                <th>Members</th>
                                <th>Points</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTeams.length > 0 ? (
                                filteredTeams.map((team) => (
                                    <tr key={team._id}>
                                        <td className="admin-td-bold">{team.name}</td>
                                        <td>{team.leader}</td>
                                        <td className="admin-td-dim">{team.members.length} members</td>
                                        <td>
                                            {editingId === team._id ? (
                                                <input
                                                    type="number"
                                                    value={editPoints}
                                                    onChange={(e) => setEditPoints(e.target.value)}
                                                    className="admin-points-input"
                                                />
                                            ) : (
                                                <span className="admin-points-display">{team.points}</span>
                                            )}
                                        </td>
                                        <td>
                                            {editingId === team._id ? (
                                                <button onClick={() => savePoints(team._id)} className="admin-btn-save">
                                                    <Save size={16} /> Save
                                                </button>
                                            ) : (
                                                <button onClick={() => { setEditingId(team._id); setEditPoints(team.points); }} className="admin-btn-edit">
                                                    <Edit2 size={16} /> Edit
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="admin-empty-state">
                                        {teams.length === 0 ? 'No teams uploaded yet. Import a CSV to get started.' : 'No teams matching your search.'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}

// ─── Main Admin Component ───
const Admin = () => {
    const [token, setToken] = useState(() => sessionStorage.getItem('adminToken') || null);

    const handleLogin = (newToken) => {
        setToken(newToken);
    };

    const handleLogout = () => {
        sessionStorage.removeItem('adminToken');
        setToken(null);
    };

    return (
        <div className="admin-page-wrapper">
            <div className="admin-page-overlay"></div>
            {token ? (
                <AdminDashboard token={token} onLogout={handleLogout} />
            ) : (
                <AdminLogin onLogin={handleLogin} />
            )}
        </div>
    );
};

export default Admin;
