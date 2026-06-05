import React from 'react';
import { BookOpen, AlertCircle, CheckCircle, Search, HelpCircle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UserManual = () => {
    const navigate = useNavigate();

    const sections = [
        {
            title: 'Getting Started',
            icon: BookOpen,
            content: 'Welcome to the Ticket Management System (TMS). This system is designed to help you quickly report and track maintenance or service issues within your department.',
            color: '#4c51bf'
        },
        {
            title: 'Reporting a Complaint',
            icon: AlertCircle,
            content: 'Navigate to "Raise Complaint" from the sidebar. Fill in the details including the block, room number, type of problem, and provide a clear description. You can also upload a photo of the issue for better clarity.',
            color: '#ecc94b'
        },
        {
            title: 'Tracking Status',
            icon: Search,
            content: 'Check "My Complaints" to see the progress of your requests. Statuses include: Pending (New), Assigned (Work started), Completed (Needs your verification), and Closed (Resolved).',
            color: '#4299e1'
        },
        {
            title: 'Closing a Ticket',
            icon: CheckCircle,
            content: 'Once the work is marked as "Completed", please verify the fix. If satisfied, you should "Close" the ticket to complete the workflow. If the issue persists, you can add a remark for further action.',
            color: '#48bb78'
        }
    ];

    return (
        <div className="manual-container">
            <header className="manual-header">
                <button onClick={() => navigate(-1)} className="back-btn">
                    <ArrowLeft size={20} /> Back
                </button>
                <div className="title-section">
                    <h1>User Manual</h1>
                    <p>Learn how to use the Ticket Management System effectively</p>
                </div>
            </header>

            <div className="manual-grid">
                {sections.map((section, index) => (
                    <div key={index} className="manual-card" style={{ '--accent': section.color }}>
                        <div className="card-icon">
                            <section.icon size={24} />
                        </div>
                        <h3>{section.title}</h3>
                        <p>{section.content}</p>
                    </div>
                ))}
            </div>

            <footer className="manual-footer">
                <div className="help-card">
                    <HelpCircle size={24} />
                    <div>
                        <h4>Need more help?</h4>
                        <p>If you have any questions not covered in this manual, please contact the IT Helpdesk or your Department Head.</p>
                    </div>
                </div>
            </footer>

            <style jsx>{`
                .manual-container {
                    max-width: 900px;
                    margin: 0 auto;
                    padding: 2rem 1rem;
                }
                .manual-header {
                    margin-bottom: 3rem;
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }
                .back-btn {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    background: none;
                    border: none;
                    color: #718096;
                    cursor: pointer;
                    font-weight: 600;
                    padding: 0;
                    width: fit-content;
                    transition: color 0.2s;
                }
                .back-btn:hover { color: #2d3748; }
                .title-section h1 {
                    font-size: 2.5rem;
                    font-weight: 800;
                    color: #1a202c;
                    margin: 0 0 0.5rem 0;
                }
                .title-section p {
                    font-size: 1.125rem;
                    color: #718096;
                    margin: 0;
                }
                .manual-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
                    gap: 1.5rem;
                    margin-bottom: 3rem;
                }
                .manual-card {
                    background: white;
                    padding: 2rem;
                    border-radius: 16px;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
                    border-top: 4px solid var(--accent);
                    transition: transform 0.2s, box-shadow 0.2s;
                }
                .manual-card:hover { rotate
                    transform: translateY(-4px);
                    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
                }
                .card-icon {
                    background: var(--accent);
                    color: white;
                    width: 48px;
                    height: 48px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 1.5rem;
                }
                .manual-card h3 {
                    font-size: 1.25rem;
                    font-weight: 700;
                    color: #2d3748;
                    margin: 0 0 1rem 0;
                }
                .manual-card p {
                    color: #4a5568;
                    line-height: 1.6;
                    margin: 0;
                }
                .manual-footer {
                    margin-top: 4rem;
                }
                .help-card {
                    background: #f7fafc;
                    border: 1px dashed #cbd5e0;
                    border-radius: 12px;
                    padding: 1.5rem;
                    display: flex;
                    align-items: flex-start;
                    gap: 1.25rem;
                    color: #4a5568;
                }
                .help-card h4 {
                    margin: 0 0 0.5rem 0;
                    color: #2d3748;
                }
                .help-card p {
                    margin: 0;
                    font-size: 0.95rem;
                }
                @media (max-width: 640px) {
                    .manual-grid { grid-template-columns: 1fr; }
                    .title-section h1 { font-size: 2rem; }
                }
            `}</style>
        </div>
    );
};

export default UserManual;
