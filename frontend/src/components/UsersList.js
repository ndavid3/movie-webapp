import React, { useEffect, useState } from 'react';
import { fetchUsers, deleteUser, changePassword } from '../api';
import { useNavigate } from 'react-router-dom';
import './UsersList.css';
import Modal from "./Modal";
import ConfirmationModal from "./ConfirmationModal";
import ChangePasswordModal from "./ChangePasswordModal";

const UsersList = () => {
    const [users, setUsers] = useState([]);
    const [setError] = useState(null);
    const navigate = useNavigate();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [userIdToDelete, setUserIdToDelete] = useState(null);

    const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
    const [userIdToChangePassword, setUserIdToChangePassword] = useState(null);
    const [newPassword, setNewPassword] = useState("");

    useEffect(() => {
        const getUsers = async () => {
            try {
                const usersData = await fetchUsers();
                setUsers(usersData);
            } catch (err) {
                setError("Failed to fetch users");
                console.error("Error fetching users:", err);
            }
        };

        getUsers();
    }, [setError]);

    const handleDeleteUser = (userId) => {
        setUserIdToDelete(userId);
        setIsDeleteConfirmOpen(true);
    };

    const confirmDeleteUser = async () => {
        setIsDeleteConfirmOpen(false);
        try {
            await deleteUser(userIdToDelete);
            setUsers(users.filter(user => user.id !== userIdToDelete));
        } catch (err) {
            setModalMessage("You can't delete your own account.");
            setIsModalOpen(true);
            console.error("Error deleting user:", err);
        }
    };

    const handleChangePassword = (userId) => {
        setUserIdToChangePassword(userId);
        setIsChangePasswordOpen(true);
    };

    const handlePasswordChange = async () => {
        if (!newPassword) {
            setModalMessage("Please enter a new password.");
            setIsModalOpen(true);
            return;
        }
        try {
            await changePassword(userIdToChangePassword, newPassword);
            setModalMessage("Password changed successfully!");
            setIsModalOpen(true);
            setIsChangePasswordOpen(false);
            setNewPassword("");
        } catch (err) {
            setModalMessage("Error changing password.");
            setIsModalOpen(true);
            console.error("Error changing password:", err);
        }
    };

    const closeModal = () => setIsModalOpen(false);
    const closeDeleteConfirm = () => setIsDeleteConfirmOpen(false);
    const closeChangePasswordModal = () => setIsChangePasswordOpen(false);

    return (
        <div className="user-list-container">
            <div className="user-list-box">
                <button
                    className="back-to-movies-button-us"
                    onClick={() => navigate('/movielist')}
                >
                    Back
                </button>

                <h3 className="user-list-title">Users List</h3>
                <div className="user-list-content">
                    {users.length === 0 ? (
                        <p>No users found</p>
                    ) : (
                        users.map(user => (
                            <div className="user-item" key={user.id}>
                                <span>{user.username}</span>
                                <div className='user-settings-buttons'>
                                    <button
                                        className="delete-user-button"
                                        onClick={() => handleDeleteUser(user.id)}
                                    >
                                        Delete
                                    </button>
                                    <button
                                        className="change-password-button"
                                        onClick={() => handleChangePassword(user.id)}
                                    >
                                        Change Password
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
            <Modal
                show={isModalOpen}
                message={modalMessage}
                onClose={closeModal}
            />

            <ConfirmationModal
                show={isDeleteConfirmOpen}
                message="Are you sure you want to delete this user?"
                onConfirm={confirmDeleteUser}
                onCancel={closeDeleteConfirm}
            />

            <ChangePasswordModal
                show={isChangePasswordOpen}
                onClose={closeChangePasswordModal}
                onPasswordChange={handlePasswordChange}
                password={newPassword}
                setPassword={setNewPassword}
            />
        </div>
    );
};

export default UsersList;
