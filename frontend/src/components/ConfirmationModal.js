import React from 'react';
import './ConfirmationModal.css';

const Modal = ({ show, message, onConfirm, onCancel }) => {
    if (!show) return null;

    return (
        <div className="confirm-modal-overlay">
            <div className="confirm-modal-content">
                <h3>{message}</h3>
                <div className="confirm-modal-buttons">
                    <button className="confirm-modal-button confirm-button" onClick={onConfirm}>
                        Confirm
                    </button>
                    <button className="confirm-modal-button cancel-button" onClick={onCancel}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Modal;
