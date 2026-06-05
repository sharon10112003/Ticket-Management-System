import React, { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import {
    Filter, MoreVertical, CheckCircle, Clock,
    UserPlus, ExternalLink, Calendar
} from 'lucide-react';

const ComplaintsList = () => {
    const { user } = useContext(AuthContext);
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [staff, setStaff] = useState([]);

    const fetchComplaints = async () => {
        try {
            const endpoint = user.role === 'SuperAdmin' ? '/complaints/all' : '/complaints/all'; // Backend handles filtering
            const res = await api.get(endpoint);
            setComplaints(res.data);
        } catch (err) {
            console.error('Error fetching complaints:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchStaff = async () => {
        if (user.role === 'SuperAdmin') {
            try {
                const res = await api.get('/masters/users');
                // Filter users who have technician/staff roles
                setStaff(res.data.filter(u => u.role?.roleName !== 'User' && u.role?.roleName !== 'SuperAdmin'));
            } catch (err) {
                console.error('Error fetching staff:', err);
            }
        }
    };

    useEffect(() => {
        fetchComplaints();
        fetchStaff();
    }, []);

    const handleAssign = async (complaintId, staffId) => {
        try {
            await api.put(`/complaints/${complaintId}/assign`, { assignedTo: staffId });
            fetchComplaints();
        } catch (err) {
            alert('Error assigning complaint');
        }
    };

    const handleStatusUpdate = async (complaintId, newStatus) => {
        try {
            await api.put(`/complaints/${complaintId}/status`, { status: newStatus });
            fetchComplaints();
        } catch (err) {
            alert('Error updating status');
        }
    };

    return (
        <div className="complaints-list">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Complaints Management</h1>
                <div className="flex gap-4">
                    <div className="search-bar">
                        <Filter size={18} />
                        <input type="text" placeholder="Filter complaints..." />
                    </div>
                </div>
            </div>

            {loading ? (
                <p>Loading complaints...</p>
            ) : (
                <div className="card overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr>
                                <th>Subject/Type</th>
                                <th>Location</th>
                                <th>Raised By</th>
                                <th>Status</th>
                                <th>Assignee</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {complaints.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-8 text-gray-500">
                                        No complaints found.
                                    </td>
                                </tr>
                            ) : complaints.map(c => (
                                <tr key={c._id}>
                                    <td>
                                        <div className="font-semibold text-gray-800">{c.complaintType}</div>
                                        <div className="text-xs text-gray-500 flex items-center gap-1">
                                            <Calendar size={12} /> {new Date(c.createdAt).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="text-sm font-medium">{c.block?.blockName}</div>
                                        <div className="text-xs text-gray-500">Room: {c.roomNumber?.roomNumber}</div>
                                    </td>
                                    <td>
                                        <div className="text-sm">{c.raisedBy?.userName}</div>
                                        <div className="text-xs text-gray-500">{c.department?.departmentName || 'N/A'}</div>
                                    </td>
                                    <td>
                                        <span className={`status-badge ${c.status.toLowerCase().replace(' ', '-')}`}>
                                            {c.status}
                                        </span>
                                    </td>
                                    <td>
                                        {user.role === 'SuperAdmin' && c.status === 'Pending' ? (
                                            <select
                                                className="assign-select"
                                                onChange={(e) => handleAssign(c._id, e.target.value)}
                                                value=""
                                            >
                                                <option value="" disabled>Assign To</option>
                                                {staff.map(s => (
                                                    <option key={s._id} value={s._id}>{s.userName} ({s.role?.roleName})</option>
                                                ))}
                                            </select>
                                        ) : (
                                            <div className="text-sm">{c.assignedTo?.userName || 'Unassigned'}</div>
                                        )}
                                    </td>
                                    <td>
                                        <div className="flex gap-2">
                                            {(c.status === 'Assigned' || c.status === 'On-Hold' || c.status === 'In-Progress') &&
                                                (user.role === 'SuperAdmin' || user.id === c.assignedTo?._id) && (
                                                    <>
                                                        {c.status === 'Assigned' && (
                                                            <button onClick={() => handleStatusUpdate(c._id, 'In-Progress')} className="action-btn info">
                                                                <Clock size={16} title="Start Progress" />
                                                            </button>
                                                        )}
                                                        {c.status === 'In-Progress' && (
                                                            <button onClick={() => handleStatusUpdate(c._id, 'Completed')} className="action-btn success">
                                                                <CheckCircle size={16} title="Complete" />
                                                            </button>
                                                        )}
                                                        {(c.status === 'Assigned' || c.status === 'In-Progress') && (
                                                            <button onClick={() => handleStatusUpdate(c._id, 'On-Hold')} className="action-btn warning">
                                                                <Clock size={16} title="On Hold" />
                                                            </button>
                                                        )}
                                                    </>
                                                )}
                                            {user.role === 'SuperAdmin' && c.status === 'Completed' && (
                                                <button onClick={() => handleStatusUpdate(c._id, 'Closed')} className="action-btn success">
                                                    <CheckCircle size={16} title="Close Ticket" />
                                                </button>
                                            )}
                                            <button className="action-btn secondary">
                                                <ExternalLink size={16} title="View Details" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <style jsx>{`
                .complaints-list { padding: 1rem; }
                .flex { display: flex; }
                .justify-between { justify-content: space-between; }
                .items-center { align-items: center; }
                .gap-4 { gap: 1rem; }
                .gap-1 { gap: 0.25rem; }
                .gap-2 { gap: 0.5rem; }
                .mb-6 { margin-bottom: 1.5rem; }
                .text-2xl { font-size: 1.5rem; }
                .font-bold { font-weight: 700; }
                .w-full { width: 100%; border-collapse: collapse; }
                
                .search-bar {
                    display: flex; align-items: center; gap: 0.5rem;
                    background: white; padding: 0.5rem 1rem;
                    border-radius: 8px; border: 1px solid #e2e8f0;
                }
                .search-bar input { border: none; outline: none; font-size: 0.9rem; }
                
                .card { background: white; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
                th, td { padding: 1.25rem 1rem; text-align: left; border-bottom: 1px solid #edf2f7; }
                th { background: #f8fafc; color: #64748b; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600; }
                
                .status-badge {
                    padding: 0.25rem 0.6rem; border-radius: 6px; font-size: 0.75rem; font-weight: 600;
                }
                .status-badge.pending { background: #fff5f5; color: #c53030; }
                .status-badge.assigned { background: #ebf8ff; color: #2b6cb0; }
                .status-badge.in-progress { background: #fefcbf; color: #b7791f; }
                .status-badge.completed { background: #f0fff4; color: #38a169; }
                
                .assign-select {
                    padding: 0.4rem; border-radius: 6px; border: 1px solid #e2e8f0;
                    font-size: 0.85rem; background: #fff; cursor: pointer;
                }
                
                .action-btn {
                    padding: 0.4rem; border-radius: 6px; border: none; cursor: pointer;
                    display: flex; align-items: center; justify-content: center;
                    transition: all 0.2s;
                }
                .action-btn.info { background: #ebf8ff; color: #2b6cb0; }
                .action-btn.success { background: #f0fff4; color: #38a169; }
                .action-btn.secondary { background: #f8fafc; color: #64748b; }
                .action-btn:hover { filter: brightness(0.9); }
            `}</style>
        </div>
    );
};

export default ComplaintsList;
