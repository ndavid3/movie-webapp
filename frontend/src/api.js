import axios from 'axios';
const API_URL = 'http://localhost:8080';

export const login = async (username, password) => {
    const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
        const token = await response.text();
        if (!token) {
            throw new Error('Login failed: No token received');
        }

        localStorage.setItem('token', token);
        console.log("Token stored:", token); 
    } else {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message || 'Login failed!');
    }
};


export const fetchMovies = async () => {
    const token = localStorage.getItem('token')?.trim();
    console.log("Fetching movies with token:", token);

    const response = await fetch(`${API_URL}/movies`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    console.log("Response status:", response.status);

    if (!response.ok) {
        const errorText = await response.text();
        console.error("Failed to fetch movies response:", errorText);
        throw new Error('Failed to fetch movies');
    }

    return await response.json();
};


export const fetchMovieById = async (id) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/movies/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch movie');
    }

    return await response.json();
};


export const fetchReviewsForMovie = async (movieId) => {
    const token = localStorage.getItem('token');

    const response = await fetch(`${API_URL}/movies/${movieId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch reviews: ' + response.statusText);
    }

    return await response.json();
};


export const addMovie = async (formData) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/movies`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
        body: formData,
    });

    if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Failed to add movie: ${response.status} ${errorMessage}`);
    }

    try {
        const result = await response.json();
        return result;
    } catch (error) {
        return null;
    }
};


export const createReview = async (movieId, review) => {
    const token = localStorage.getItem('token');

    const response = await fetch(`${API_URL}/movies/${movieId}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ body: review.content }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error("Failed to create review:", errorText);
        throw new Error('Failed to create review: ' + response.statusText);
    }

    return await response.json();
};


export const updateReview = async (movieId, reviewId, updatedReviewData) => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/movies/${movieId}/reviews/${reviewId}`, {
            method: "PUT",
            headers: {
                'Authorization': `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedReviewData),
        });
        if (!response.ok) {
            throw new Error("Failed to update review");
        }
        return await response.json();
    } catch (err) {
        throw new Error(err.message || "An unexpected error occurred.");
    }
};


export const deleteReview = async (movieId, reviewId) => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/movies/${movieId}/reviews/${reviewId}`, {
            method: "DELETE",
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        console.log("Delete response status:", response.status);

        if (response.status === 204) {
            console.log("Review deleted successfully with no content returned");
            return null;
        }

        const responseBody = await response.json();
        console.log("Delete response body:", responseBody); 

        if (!response.ok) {
            throw new Error("Failed to delete review");
        }

        return responseBody;

    } catch (err) {
        console.error("Error in deleteReview:", err);
        throw err;
    }
};


export const deleteMovie = async (id) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/movies/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to delete movie');
    }
};


export const updateMovie = async (id, formData) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/movies/${id}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
        body: formData,
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error("Update movie error:", errorText); 
        throw new Error('Failed to update movie: ' + errorText);
    }

    return await response.json();
};


export const logout = () => {
    localStorage.removeItem('token');
    console.log("User logged out.");
};


export const registerUser = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/register`, userData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error during registration:", error);
        throw new Error(error.response?.data?.message || 'Registration failed');
    }
};


export const fetchUsers = async () => {
    try {
        const token = localStorage.getItem('token');

        const response = await fetch(`${API_URL}/userlist`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch users');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
};


export const deleteUser = async (userId) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/userlist/${userId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });
    if (!response.ok) {
        throw new Error('Failed to delete user');
    }
};


export const changePassword = async (userId, newPassword) => {
    const token = localStorage.getItem("token");

    try {
        const response = await axios.post(
            `${API_URL}/userlist/${userId}`,
            { newPassword },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error changing password:", error);
        throw new Error("Failed to change password.");
    }
};
