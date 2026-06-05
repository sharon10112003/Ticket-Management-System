import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Filter, FileText, Download, Printer, Search } from 'lucide-react';

const Reports = () => {
    const [departments, setDepartments] = useState([]);
    const [programmes, setProgrammes] = useState([]);
    const [staff, setStaff] = useState([]);
    const [reportData, setReportData] = useState([]);
    const [loading, setLoading] = useState(false);

    const [filters, setFilters] = useState({
        department: '',
        programme: '',
        complaintType: '',
        status: '',
        assignedTo: ''
    });

    const complaintTypes = [
        'PC Hardware', 'PC Software', 'Application Issues',
        'Network', 'Electronics', 'Plumbing', 'Other'
    ];

    const statuses = ['Pending', 'Assigned', 'In-Progress', 'On-Hold', 'Completed', 'Closed'];

    useEffect(() => {
        const fetchFilterOptions = async () => {
            try {
                const [deptRes, progRes, userRes] = await Promise.all([
                    api.get('/masters/departments'),
                    api.get('/masters/programmes'),
                    api.get('/masters/users')
                ]);
                setDepartments(deptRes.data);
                setProgrammes(progRes.data);
                setStaff(userRes.data.filter(u => u.role?.roleName !== 'User' && u.role?.roleName !== 'SuperAdmin'));
            } catch (err) {
                console.error('Error fetching filter options:', err);
            }
        };
        fetchFilterOptions();
    }, []);

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const generateReport = async () => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams();
            Object.entries(filters).forEach(([key, value]) => {
                if (value) queryParams.append(key, value);
            });
            const res = await api.get(`/complaints/report?${queryParams.toString()}`);
            setReportData(res.data);
        } catch (err) {
            alert('Error generating report');
        } finally {
            setLoading(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="reports-page">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <FileText size={28} color="#764ba2" /> Complaint Details Report
                </h1>
                <div className="flex gap-3 no-print">
                    <button onClick={handlePrint} className="btn-secondary flex items-center gap-2">
                        <Printer size={18} /> Print Report
                    </button>
                    <button className="btn-primary flex items-center gap-2" disabled={reportData.length === 0}>
                        <Download size={18} /> Export CSV
                    </button>
                </div>
            </div>

            <div className="card filter-section mb-8 no-print">
                <h3 className="mb-4 font-bold flex items-center gap-2 text-gray-700">
                    <Filter size={18} /> Filters
                </h3>
                <div className="grid grid-cols-5 gap-4">
                    <div className="form-group">
                        <label>Department</label>
                        <select name="department" value={filters.department} onChange={handleFilterChange}>
                            <option value="">All Departments</option>
                            {departments.map(d => <option key={d._id} value={d._id}>{d.departmentName}</option>)}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Programme</label>
                        <select name="programme" value={filters.programme} onChange={handleFilterChange}>
                            <option value="">All Programmes</option>
                            {programmes.map(p => <option key={p._id} value={p._id}>{p.programmeName}</option>)}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Complaint Type</label>
                        <select name="complaintType" value={filters.complaintType} onChange={handleFilterChange}>
                            <option value="">All Types</option>
                            {complaintTypes.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Status</label>
                        <select name="status" value={filters.status} onChange={handleFilterChange}>
                            <option value="">All Statuses</option>
                            {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Assignee</label>
                        <select name="assignedTo" value={filters.assignedTo} onChange={handleFilterChange}>
                            <option value="">All Staff</option>
                            {staff.map(s => <option key={s._id} value={s._id}>{s.userName}</option>)}
                        </select>
                    </div>
                </div>
                <div className="mt-6 flex justify-end">
                    <button onClick={generateReport} className="btn-primary flex items-center gap-2 px-8">
                        <Search size={18} /> Generate Report
                    </button>
                </div>
            </div>

            <div className="report-results card overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-gray-500">Generating report...</div>
                ) : reportData.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        {filters.department || filters.status ? 'No records match your filters.' : 'Set filters and click "Generate Report" to see data.'}
                    </div>
                ) : (
                    <table className="w-full">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Ticket Details</th>
                                <th>Location</th>
                                <th>Reported By</th>
                                <th>Assigned To</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reportData.map(c => (
                                <tr key={c._id}>
                                    <td>{new Date(c.createdAt).toLocaleDateString()}</td>
                                    <td>
                                        <div className="font-bold">{c.complaintType}</div>
                                        <div className="text-xs text-gray-500 line-clamp-1">{c.complaintRemarks}</div>
                                    </td>
                                    <td>
                                        {c.block?.blockName} - {c.roomNumber?.roomNumber}
                                    </td>
                                    <td>{c.raisedBy?.userName}</td>
                                    <td>{c.assignedTo?.userName || 'Unassigned'}</td>
                                    <td>
                                        <span className={`status-badge ${c.status.toLowerCase()}`}>{c.status}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <style jsx>{`
                .reports-page { max-width: 1200px; margin: 0 auto; }
                .flex { display: flex; }
                .justify-between { justify-content: space-between; }
                .items-center { align-items: center; }
                .grid { display: grid; }
                .grid-cols-5 { grid-template-columns: repeat(5, 1fr); }
                .gap-3 { gap: 0.75rem; }
                .gap-4 { gap: 1rem; }
                .gap-2 { gap: 0.5rem; }
                .mb-6 { margin-bottom: 1.5rem; }
                .mb-8 { margin-bottom: 2rem; }
                .mb-4 { margin-bottom: 1rem; }
                .mt-6 { margin-top: 1.5rem; }
                .text-2xl { font-size: 1.5rem; }
                .font-bold { font-weight: 700; }
                
                .btn-primary {
                    background: #764ba2; color: white; padding: 0.6rem 1.2rem;
                    border-radius: 8px; border: none; cursor: pointer; font-weight: 600;
                }
                .btn-secondary {
                    background: #edf2f7; color: #4a5568; padding: 0.6rem 1.2rem;
                    border-radius: 8px; border: 1px solid #e2e8f0; cursor: pointer; font-weight: 600;
                }
                .card { background: white; padding: 1.5rem; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
                
                .form-group { display: flex; flex-direction: column; gap: 0.4rem; }
                .form-group label { font-size: 0.8rem; font-weight: 600; color: #718096; }
                .form-group select { padding: 0.6rem; border-radius: 8px; border: 1px solid #e2e8f0; background: #fff; }
                
                table { border-collapse: collapse; width: 100%; }
                th, td { padding: 1rem; text-align: left; border-bottom: 1px solid #edf2f7; font-size: 0.9rem; }
                th { background: #f8fafc; color: #64748b; font-weight: 600; text-transform: uppercase; font-size: 0.75rem; }
                
                .status-badge { padding: 0.2rem 0.6rem; border-radius: 4px; font-weight: 700; font-size: 0.75rem; }
                .status-badge.pending { background: #fee2e2; color: #b91c1c; }
                .status-badge.completed { background: #d1fae5; color: #047857; }
                .status-badge.assigned { background: #dbeafe; color: #1d4ed8; }

                @media print {
                    .no-print { display: none !important; }
                    .reports-page { padding: 0; }
                    .card { box-shadow: none; border: 1px solid #eee; }
                }
            `}</style>
        </div>
    );
};

export default Reports;
