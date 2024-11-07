import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api";
import Modal from "./Modal";
import "./Login.css";

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            await login(username, password);
            onLogin();
            navigate("/movies");
        } catch (err) {
            console.error("Login error:", err);
            setModalMessage("Login failed. If you forgot your password, notify an admin.");
            setIsModalOpen(true);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2 className="login-text">Login</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="username">Username:</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="login-buttons">
                        <div className="login-button">
                            <button type="submit">Login</button>
                        </div>
                        <div className="register-button">
                            <button
                                onClick={() =>
                                    (window.location.href = "/register")
                                }
                            >
                                Register
                            </button>
                        </div>
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

export default Login;
