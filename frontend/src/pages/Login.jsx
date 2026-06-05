import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            setError('Invalid email or password');
        }
    };

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit} className="login-form">
                <div className="login-header">
                    <LogIn size={48} className="login-icon" />
                    <h1>TMS Login</h1>
                </div>
                {error && <p className="error-message">{error}</p>}
                <div className="form-group">
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="admin@tms.com"
                    />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="******"
                    />
                </div>
                <button type="submit" className="login-button">Login</button>
            </form>
            <style jsx>{`
                .login-container {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                }
                .login-form {
                    background: white;
                    padding: 2.5rem;
                    border-radius: 12px;
                    box-shadow: 0 10px 25px rgba(0,0,0,0.2);
                    width: 100%;
                    max-width: 400px;
                }
                .login-header {
                    text-align: center;
                    margin-bottom: 2rem;
                }
                .login-icon {
                    color: #764ba2;
                    margin-bottom: 1rem;
                }
                .login-form h1 {
                    margin: 0;
                    color: #333;
                    font-size: 1.8rem;
                }
                .form-group {
                    margin-bottom: 1.5rem;
                }
                .form-group label {
                    display: block;
                    margin-bottom: 0.5rem;
                    color: #555;
                    font-weight: 500;
                }
                .form-group input {
                    width: 100%;
                    padding: 0.75rem;
                    border: 1px solid #ddd;
                    border-radius: 6px;
                    font-size: 1rem;
                }
                .login-button {
                    width: 100%;
                    padding: 0.75rem;
                    background: #764ba2;
                    color: white;
                    border: none;
                    border-radius: 6px;
                    font-size: 1.1rem;
                    cursor: pointer;
                    transition: background 0.3s;
                }
                .login-button:hover {
                    background: #667eea;
                }
                .error-message {
                    color: #e53e3e;
                    background: #fff5f5;
                    padding: 0.5rem;
                    border-radius: 4px;
                    margin-bottom: 1rem;
                    text-align: center;
                }
            `}</style>
        </div>
    );
};

export default Login;
