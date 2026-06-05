import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import {
    Activity, Clock, UserCheck, CheckCircle2,
    AlertCircle, BarChart3, TrendingUp
} from 'lucide-react';

const StatCard = ({ title, count, icon: Icon, color }) => (
    <div className="stat-card" style={{ '--accent-color': color }}>
        <div className="stat-content">
            <p className="stat-title">{title}</p>
            <h2 className="stat-count">{count}</h2>
        </div>
        <div className="stat-icon-wrapper">
            <Icon size={24} />
        </div>
        <style jsx>{`
            .stat-card {
                background: white;
                padding: 1.5rem;
                border-radius: 12px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                box-shadow: 0 4px 6px rgba(0,0,0,0.05);
                border-left: 4px solid var(--accent-color);
                transition: transform 0.2s;
            }
            .stat-card:hover { transform: translateY(-3px); }
            .stat-title { color: #718096; font-size: 0.875rem; font-weight: 500; margin: 0; }
            .stat-count { color: #2d3748; font-size: 1.5rem; font-weight: 700; margin: 0.25rem 0 0; }
            .stat-icon-wrapper {
                background: var(--accent-color);
                color: white;
                padding: 0.75rem;
                border-radius: 10px;
                opacity: 0.9;
            }
        `}</style>
    </div>
);

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        total: 0, pending: 0, assigned: 0, inProgress: 0,
        onHold: 0, completed: 0, closed: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/complaints/stats');
                setStats(res.data);
            } catch (err) {
                console.error('Error fetching stats:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <div>Loading Stats...</div>;

    return (
        <div className="dashboard">
            <header className="dashboard-header mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Welcome Back, {user?.userName}!</h1>
                    <p className="text-gray-500">Here's what's happening today in your department.</p>
                </div>
                <div className="header-badge">
                    <TrendingUp size={16} /> Status Overview
                </div>
            </header>

            <div className="grid grid-cols-4 gap-6 mb-8">
                <StatCard title="Total Complaints" count={stats.total} icon={Activity} color="#4c51bf" />
                <StatCard title="Pending" count={stats.pending} icon={Clock} color="#ecc94b" />
                <StatCard title="Assigned" count={stats.assigned} icon={UserCheck} color="#4299e1" />
                <StatCard title="Completed" count={stats.completed} icon={CheckCircle2} color="#48bb78" />
            </div>

            <div className="dashboard-content grid grid-cols-2 gap-6">
                <div className="card status-breakdown">
                    <h3 className="mb-4 font-bold flex items-center gap-2">
                        <BarChart3 size={18} /> Detailed Breakdown
                    </h3>
                    <ul className="status-list">
                        <li>
                            <span>In Progress</span>
                            <span className="badge info">{stats.inProgress}</span>
                        </li>
                        <li>
                            <span>On Hold</span>
                            <span className="badge warning">{stats.onHold}</span>
                        </li>
                        <li>
                            <span>Closed</span>
                            <span className="badge success">{stats.closed}</span>
                        </li>
                    </ul>
                </div>
                <div className="card help-box">
                    <h3 className="mb-4 font-bold flex items-center gap-2">
                        <AlertCircle size={18} /> Quick Help
                    </h3>
                    <p className="text-sm text-gray-600">
                        Need assistance? Contact the SuperAdmin for any system related issues or permission requests.
                    </p>
                    <button 
                        className="btn-outline-primary mt-4"
                        onClick={() => navigate('/user-manual')}
                    >
                        View User Manual
                    </button>
                </div>
            </div>

            <style jsx>{`
                .dashboard { max-width: 1200px; margin: 0 auto; }
                .dashboard-header { display: flex; justify-content: space-between; align-items: flex-start; }
                .header-badge {
                    background: #ebf4ff;
                    color: #2b6cb0;
                    padding: 0.5rem 1rem;
                    border-radius: 20px;
                    font-size: 0.875rem;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }
                .grid { display: grid; }
                .grid-cols-4 { grid-template-columns: repeat(4, 1fr); }
                .grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
                .gap-6 { gap: 1.5rem; }
                .mb-8 { margin-bottom: 2rem; }
                .mb-4 { margin-bottom: 1rem; }
                .mt-4 { margin-top: 1rem; }
                .card { background: white; padding: 1.5rem; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
                .status-list { list-style: none; padding: 0; margin: 0; }
                .status-list li {
                    display: flex; justify-content: space-between; align-items: center;
                    padding: 0.75rem 0; border-bottom: 1px solid #edf2f7;
                }
                .status-list li:last-child { border-bottom: none; }
                .badge { padding: 0.25rem 0.75rem; border-radius: 15px; font-size: 0.75rem; font-weight: 700; }
                .badge.info { background: #e6fffa; color: #319795; }
                .badge.warning { background: #fffaf0; color: #dd6b20; }
                .badge.success { background: #f0fff4; color: #38a169; }
                .btn-outline-primary {
                    background: transparent; border: 1px solid #764ba2; color: #764ba2;
                    padding: 0.5rem 1rem; border-radius: 6px; cursor: pointer;
                    transition: all 0.2s;
                }
                .btn-outline-primary:hover { background: #764ba2; color: white; }
            `}</style>
        </div>
    );
};

export default Dashboard;
