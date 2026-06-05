import React, { useContext } from 'react';
import { NavLink, useNavigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LayoutDashboard, Users, FileText, Settings, LogOut, Menu } from 'lucide-react';

const Layout = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="app-container">
            <aside className="sidebar">
                <div className="sidebar-header">
                    <h2>TMS</h2>
                </div>
                <nav className="sidebar-nav">
                    <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>
                        <LayoutDashboard size={20} /> Dashboard
                    </NavLink>

                    {user?.role === 'SuperAdmin' && (
                        <>
                            <div className="nav-section">Masters</div>
                            <NavLink to="/departments">Department</NavLink>
                            <NavLink to="/programmes">Programme</NavLink>
                            <NavLink to="/blocks">Block</NavLink>
                            <NavLink to="/rooms">Room Number</NavLink>
                            <NavLink to="/roles">Role</NavLink>
                            <NavLink to="/users">User</NavLink>
                        </>
                    )}

                    <div className="nav-section">Transactions</div>
                    {(user?.role === 'User' || user?.role === 'SuperAdmin') && (
                        <NavLink to="/complaints/new">Raise Complaint</NavLink>
                    )}
                    <NavLink to="/complaints">
                        {user?.role === 'User' ? 'My Complaints' : 'Complaints List'}
                    </NavLink>

                    {user?.role === 'SuperAdmin' && (
                        <>
                            <div className="nav-section">Reports</div>
                            <NavLink to="/reports">Reports</NavLink>
                        </>
                    )}
                </nav>
                <div className="sidebar-footer">
                    <div className="user-info">
                        <p>{user?.userName}</p>
                        <span>{user?.role}</span>
                    </div>
                    <button onClick={handleLogout} className="logout-btn">
                        <LogOut size={18} /> Logout
                    </button>
                </div>
            </aside>
            <main className="main-content">
                <Outlet />
            </main>

            <style jsx>{`
                .app-container {
                    display: flex;
                    height: 100vh;
                    background: #f4f7fe;
                }
                .sidebar {
                    width: 260px;
                    background: #1a202c;
                    color: white;
                    display: flex;
                    flex-direction: column;
                }
                .sidebar-header {
                    padding: 2rem;
                    text-align: center;
                    border-bottom: 1px solid #2d3748;
                }
                .sidebar-nav {
                    flex: 1;
                    padding: 1.5rem 1rem;
                    overflow-y: auto;
                }
                .sidebar-nav a {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 0.75rem 1rem;
                    color: #a0aec0;
                    text-decoration: none;
                    border-radius: 8px;
                    margin-bottom: 0.5rem;
                    transition: all 0.2s;
                    font-size: 0.95rem;
                }
                .sidebar-nav a:hover, .sidebar-nav a.active {
                    background: #2d3748;
                    color: white;
                }
                .nav-section {
                    font-size: 0.75rem;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    color: #718096;
                    margin: 1.5rem 0 0.5rem 1rem;
                }
                .main-content {
                    flex: 1;
                    padding: 2rem;
                    overflow-y: auto;
                }
                .sidebar-footer {
                    padding: 1.5rem;
                    border-top: 1px solid #2d3748;
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }
                .user-info p {
                    margin: 0;
                    font-weight: 600;
                }
                .user-info span {
                    font-size: 0.8rem;
                    color: #a0aec0;
                }
                .logout-btn {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                    padding: 0.6rem;
                    background: #e53e3e;
                    color: white;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                }
            `}</style>
        </div>
    );
};

export default Layout;
