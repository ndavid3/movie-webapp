import React from 'react';
import './ChangePasswordModal.css';

const ChangePasswordModal = ({ show, onClose, onPasswordChange, password, setPassword }) => {
    if (!show) return null;

    return (
        <div className="change-pass-modal-overlay">
            <div className="change-pass-modal-container">
                <h2>Change Password</h2>
                <input
                    type="password"
                    placeholder="New Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <div className="change-pass-modal-buttons">
                    <button className='change-pass-modal-button change-pass' onClick={onPasswordChange}>Change Password</button>
                    <button className='change-pass-modal-button cancel-pass' onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default ChangePasswordModal;
