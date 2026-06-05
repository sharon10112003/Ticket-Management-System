import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Send, Image as ImageIcon, CheckCircle } from 'lucide-react';

const RaiseComplaint = () => {
    const [blocks, setBlocks] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitted, setSubmitted] = useState(false);

    const [formData, setFormData] = useState({
        block: '',
        roomNumber: '',
        complaintType: '',
        complaintRemarks: '',
        complaintAttachment: ''
    });

    const complaintTypes = [
        'PC Hardware', 'PC Software', 'Application Issues',
        'Network', 'Electronics', 'Plumbing', 'Other'
    ];

    useEffect(() => {
        const fetchMasters = async () => {
            try {
                const blockRes = await api.get('/masters/blocks');
                setBlocks(blockRes.data);
                const roomRes = await api.get('/masters/rooms');
                setRooms(roomRes.data);
            } catch (err) {
                console.error('Error fetching masters:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchMasters();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/complaints', formData);
            setSubmitted(true);
            setFormData({
                block: '',
                roomNumber: '',
                complaintType: '',
                complaintRemarks: '',
                complaintAttachment: ''
            });
        } catch (err) {
            alert('Error raising complaint: ' + (err.response?.data?.message || err.message));
        }
    };

    if (submitted) {
        return (
            <div className="success-container">
                <CheckCircle size={64} color="#48bb78" />
                <h1>Complaint Raised Successfully!</h1>
                <p>Your ticket has been recorded and will be addressed shortly.</p>
                <button onClick={() => setSubmitted(false)} className="btn-primary">Raise Another</button>
                <style jsx>{`
                    .success-container {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        height: 60vh;
                        text-align: center;
                    }
                    .success-container h1 { margin-top: 1.5rem; color: #2d3748; }
                    .success-container p { color: #718096; margin-bottom: 2rem; }
                    .btn-primary {
                        background: #764ba2;
                        color: white;
                        padding: 0.75rem 1.5rem;
                        border-radius: 8px;
                        border: none;
                        cursor: pointer;
                        font-weight: 600;
                    }
                `}</style>
            </div>
        );
    }

    return (
        <div className="raise-complaint">
            <h1 className="text-2xl font-bold mb-6">Raise a Complaint</h1>

            <form onSubmit={handleSubmit} className="complaint-card grid gap-6">
                <div className="form-row">
                    <div className="form-group flex-1">
                        <label>Block Name</label>
                        <select name="block" value={formData.block} onChange={handleChange} required>
                            <option value="">Select Block</option>
                            {blocks.map(b => <option key={b._id} value={b._id}>{b.blockName}</option>)}
                        </select>
                    </div>
                    <div className="form-group flex-1">
                        <label>Room Number</label>
                        <select name="roomNumber" value={formData.roomNumber} onChange={handleChange} required>
                            <option value="">Select Room</option>
                            {rooms.filter(r => r.block?._id === formData.block || !formData.block).map(r => (
                                <option key={r._id} value={r._id}>{r.roomNumber}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="form-group">
                    <label>Complaint Type</label>
                    <select name="complaintType" value={formData.complaintType} onChange={handleChange} required>
                        <option value="">Select Type</option>
                        {complaintTypes.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                </div>

                <div className="form-group">
                    <label>Complaint Remarks</label>
                    <textarea
                        name="complaintRemarks"
                        value={formData.complaintRemarks}
                        onChange={handleChange}
                        required
                        rows="4"
                        placeholder="Describe the issue in detail..."
                    ></textarea>
                </div>

                <div className="form-group">
                    <label>Attachment (URL/Path)</label>
                    <div className="attachment-input">
                        <ImageIcon size={20} color="#a0aec0" />
                        <input
                            type="text"
                            name="complaintAttachment"
                            value={formData.complaintAttachment}
                            onChange={handleChange}
                            placeholder="Link to photo or file..."
                        />
                    </div>
                </div>

                <button type="submit" className="submit-btn flex items-center justify-center gap-2">
                    <Send size={20} /> Submit Complaint
                </button>
            </form>

            <style jsx>{`
                .raise-complaint { max-width: 800px; margin: 0 auto; }
                .complaint-card {
                    background: white;
                    padding: 2rem;
                    border-radius: 12px;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.08);
                }
                .grid { display: grid; }
                .gap-6 { gap: 1.5rem; }
                .form-row { display: flex; gap: 1.5rem; }
                .flex-1 { flex: 1; }
                .form-group { display: flex; flex-direction: column; gap: 0.5rem; }
                .form-group label { font-weight: 600; color: #4a5568; font-size: 0.9rem; }
                .form-group select, .form-group textarea, .form-group input {
                    padding: 0.75rem;
                    border: 1px solid #e2e8f0;
                    border-radius: 8px;
                    font-size: 1rem;
                }
                .attachment-input {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0 0.75rem;
                    border: 1px solid #e2e8f0;
                    border-radius: 8px;
                }
                .attachment-input input { border: none; padding: 0.75rem 0; flex: 1; }
                .attachment-input input:focus { outline: none; }
                .submit-btn {
                    padding: 0.85rem;
                    background: #764ba2;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    font-size: 1.1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: transform 0.2s, background 0.2s;
                }
                .submit-btn:hover { background: #667eea; transform: translateY(-2px); }
            `}</style>
        </div>
    );
};

export default RaiseComplaint;
