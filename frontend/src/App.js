import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import MovieList from './components/MovieList';
import MovieDetail from './components/MovieDetail';
import Login from './components/Login';
import Register from './components/Register';
import { logout } from './api';
import './App.css';
import AddMovie from './components/AddMovie';
import MovieUpdateForm from './components/MovieUpdateForm';
import UsersList from './components/UsersList';

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
    const navigate = useNavigate();

    const handleLogin = () => {
        setIsAuthenticated(true);
        navigate('/movies');
    };

    const handleLogout = useCallback(() => {
        logout();
        setIsAuthenticated(false);
        navigate('/login');
    }, [navigate]);

    useEffect(() => {
        const checkTokenExpiration = () => {
            const token = localStorage.getItem('token');
            if (!token) return;

            try {
                const decodedToken = jwtDecode(token);
                const currentTime = Date.now() / 1000;
                if (decodedToken.exp < currentTime) {
                    handleLogout();
                }
            } catch (error) {
                console.error("Error decoding token:", error);
            }
        };

        checkTokenExpiration();
        const interval = setInterval(checkTokenExpiration, 60000);
        return () => clearInterval(interval);
    }, [handleLogout]);

    return (
        <div>
            {isAuthenticated ? (
                <>
                    <div className="logout-container">
                        <button onClick={handleLogout} className="logout-button">Logout</button>
                    </div>
                    <Routes>
                        <Route path="/movies" element={<MovieList />} />
                        <Route path="/movies/:id" element={<MovieDetail />} />
                        <Route path="/*" element={<Navigate to="/movies" />} />
                        <Route path="/add-movie" element={<AddMovie />} />
                        <Route path="/movies/update/:id" element={<MovieUpdateForm />} />
                        <Route path="/users" element={<UsersList />} />
                    </Routes>
                </>
            ) : (
                <Routes>
                    <Route path="/login" element={<Login onLogin={handleLogin} />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/*" element={<Navigate to="/login" />} />
                </Routes>
            )}
        </div>
    );
};

const AppWrapper = () => (
    <Router>
        <App />
    </Router>
);

export default AppWrapper;
