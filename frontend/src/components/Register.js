import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../api';
import './Register.css';
import Modal from "./Modal";

const Register = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('USER');
    const [secret, setSecret] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage(''); 

        try {
            const userData = { username, password, role, secret };
            await registerUser(userData);
            setModalMessage('Registration successful! You can now log in.');
            setIsModalOpen(true);
        } catch (err) {
            setModalMessage('Registration failed.');
            setIsModalOpen(true);
        }
    };


    const handleBack = () => {
        navigate('/login');
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className='register-user-container'>
            <button onClick={handleBack} className="back-to-login-button">Back</button>
            <div className="register-user-box">
                <h2>Register</h2>
                {error && <p className="register-error-message">{error}</p>}
                {successMessage && <p className="register-success-message">{successMessage}</p>}
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="username">Username:</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="role">Role:</label>
                        <select
                            id="role"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                        >
                            <option value="USER">User</option>
                            <option value="ADMIN">Admin</option>
                        </select>
                    </div>
                    {role === 'ADMIN' && (
                        <div>
                            <label htmlFor="secret">Admin Secret:</label>
                            <input
                                type="password"
                                id="secret"
                                value={secret}
                                onChange={(e) => setSecret(e.target.value)}
                                required={role === 'ADMIN'}
                            />
                        </div>
                    )}
                    <div>
                        <button type="submit">Register</button>
                    </div>
                </form>
            </div>
            <Modal 
                show={isModalOpen} 
                message={modalMessage} 
                onClose={closeModal} 
            />
        </div>
    );
};

export default Register;
