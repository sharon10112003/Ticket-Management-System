import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Plus, Edit, Trash2, X, Save } from 'lucide-react';

const MasterScreen = ({ title, endpoint, fields }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({});
    const [options, setOptions] = useState({});

    const fetchData = async () => {
        try {
            const res = await api.get(endpoint);
            setData(res.data);

            // Fetch options for relational fields
            const optionsData = {};
            for (const field of fields) {
                if (field.type === 'select-model') {
                    const optRes = await api.get(field.endpoint);
                    optionsData[field.name] = optRes.data;
                }
            }
            setOptions(optionsData);
        } catch (err) {
            console.error('Error fetching data:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const initialForm = {};
        fields.forEach(f => initialForm[f.name] = '');
        setFormData(initialForm);
    }, [endpoint]);

    const handleOpenModal = (item = null) => {
        if (item) {
            setEditingItem(item);
            const editData = {};
            fields.forEach(f => {
                if (f.type === 'select-model') {
                    editData[f.name] = item[f.name]?._id || item[f.name] || '';
                } else {
                    editData[f.name] = item[f.name] || '';
                }
            });
            setFormData(editData);
        } else {
            setEditingItem(null);
            const initialForm = {};
            fields.forEach(f => initialForm[f.name] = '');
            setFormData(initialForm);
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingItem(null);
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Sanitize data: convert empty strings for select-model fields to null
            const sanitizedData = { ...formData };
            fields.forEach(f => {
                if (f.type === 'select-model' && sanitizedData[f.name] === '') {
                    sanitizedData[f.name] = null;
                }
            });

            if (editingItem) {
                await api.put(`${endpoint}/${editingItem._id}`, sanitizedData);
            } else {
                await api.post(endpoint, sanitizedData);
            }
            fetchData();
            handleCloseModal();
        } catch (err) {
            alert('Error saving data: ' + (err.response?.data?.message || err.message));
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            try {
                await api.delete(`${endpoint}/${id}`);
                fetchData();
            } catch (err) {
                alert('Error deleting data');
            }
        }
    };

    return (
        <div className="master-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">{title}</h1>
                <button onClick={() => handleOpenModal()} className="btn-primary flex items-center gap-2">
                    <Plus size={20} /> Add New
                </button>
            </div>

            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="card overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr>
                                {fields.filter(f => !f.hideInTable).map(f => <th key={f.name}>{f.label}</th>)}
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map(item => (
                                <tr key={item._id}>
                                    {fields.filter(f => !f.hideInTable).map(f => (
                                        <td key={f.name}>
                                            {f.type === 'select-model' && item[f.name]
                                                ? item[f.name][f.displayField]
                                                : (f.type === 'password' ? '********' : item[f.name])}
                                        </td>
                                    ))}
                                    <td className="flex gap-2">
                                        <button onClick={() => handleOpenModal(item)} className="text-blue-600 hover:text-blue-800">
                                            <Edit size={18} />
                                        </button>
                                        <button onClick={() => handleDelete(item._id)} className="text-red-600 hover:text-red-800">
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>{editingItem ? `Edit ${title}` : `Add New ${title}`}</h2>
                            <button onClick={handleCloseModal}><X size={24} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="modal-body">
                            {fields.map(f => (
                                <div key={f.name} className="form-group mb-4">
                                    <label className="block mb-1 font-medium">{f.label}</label>
                                    {(f.type === 'text' || f.type === 'password') && (
                                        <input
                                            type={f.type}
                                            name={f.name}
                                            value={formData[f.name]}
                                            onChange={handleInputChange}
                                            required={editingItem ? false : f.required}
                                            className="input-field"
                                            placeholder={editingItem && f.type === 'password' ? 'Leave blank to keep current' : ''}
                                        />
                                    )}
                                    {f.type === 'select-model' && (
                                        <select
                                            name={f.name}
                                            value={formData[f.name]}
                                            onChange={handleInputChange}
                                            required={f.required}
                                            className="input-field"
                                        >
                                            <option value="">Select {f.label}</option>
                                            {options[f.name]?.map(opt => (
                                                <option key={opt._id} value={opt._id}>
                                                    {opt[f.displayField]}
                                                </option>
                                            ))}
                                        </select>
                                    )}
                                    {/* More field types like select-model can be added here */}
                                </div>
                            ))}
                            <div className="flex justify-end gap-3 mt-6">
                                <button type="button" onClick={handleCloseModal} className="btn-secondary">Cancel</button>
                                <button type="submit" className="btn-primary">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <style jsx>{`
                .master-screen {
                    padding: 1rem;
                }
                .flex { display: flex; }
                .justify-between { justify-content: space-between; }
                .items-center { align-items: center; }
                .mb-6 { margin-bottom: 1.5rem; }
                .mb-4 { margin-bottom: 1rem; }
                .mt-6 { margin-top: 1.5rem; }
                .gap-2 { gap: 0.5rem; }
                .gap-3 { gap: 0.75rem; }
                .text-2xl { font-size: 1.5rem; }
                .font-bold { font-weight: 700; }
                .w-full { width: 100%; }
                .text-blue-600 { color: #2563eb; }
                .text-red-600 { color: #dc2626; }
                
                .btn-primary {
                    background: #764ba2;
                    color: white;
                    padding: 0.5rem 1rem;
                    border-radius: 6px;
                    border: none;
                    cursor: pointer;
                }
                .btn-secondary {
                    background: #e2e8f0;
                    color: #4a5568;
                    padding: 0.5rem 1rem;
                    border-radius: 6px;
                    border: none;
                    cursor: pointer;
                }
                .card {
                    background: white;
                    padding: 1.5rem;
                    border-radius: 10px;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.05);
                }
                table { border-collapse: collapse; }
                th, td {
                    text-align: left;
                    padding: 1rem;
                    border-bottom: 1px solid #edf2f7;
                }
                th { color: #718096; font-weight: 600; font-size: 0.875rem; }

                .modal-overlay {
                    position: fixed;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background: rgba(0,0,0,0.5);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 1000;
                }
                .modal-content {
                    background: white;
                    width: 100%;
                    max-width: 500px;
                    border-radius: 12px;
                    box-shadow: 0 20px 25px rgba(0,0,0,0.1);
                }
                .modal-header {
                    padding: 1.5rem;
                    border-bottom: 1px solid #edf2f7;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .modal-body { padding: 1.5rem; }
                .input-field {
                    width: 100%;
                    padding: 0.75rem;
                    border: 1px solid #e2e8f0;
                    border-radius: 6px;
                }
            `}</style>
        </div>
    );
};

export default MasterScreen;
