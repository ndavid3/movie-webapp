import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchMovieById, createReview, deleteMovie } from "../api";
import ReviewList from "./ReviewList";
import ReviewForm from "./ReviewForm";
import "./MovieDetail.css";
import { updateReview, deleteReview } from "../api";
import Modal from "./Modal";
import ConfirmationModal from "./ConfirmationModal"; 

const MovieDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [movie, setMovie] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [editingReview, setEditingReview] = useState(null);
    const [error, setError] = useState(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

    useEffect(() => {
        const getMovie = async () => {
            try {
                const movieData = await fetchMovieById(id);
                setMovie(movieData);
                setReviews(movieData.reviews || []);
            } catch (err) {
                setError("Failed to fetch movie details");
            }
        };
        getMovie();
    }, [id]);

    const handleReviewSubmit = async (reviewData) => {
        try {
            await createReview(id, {
                content: reviewData.content,
            });
            const updatedMovie = await fetchMovieById(id);
            setMovie(updatedMovie);
            setReviews(updatedMovie.reviews || []);
        } catch (err) {
            setModalMessage("Failed to create review");
            setIsModalOpen(true);
            console.error(err);
        }
    };

    const handleDeleteMovie = () => {
        setIsDeleteConfirmOpen(true);
    };

    const confirmDeleteMovie = async () => {
        setIsDeleteConfirmOpen(false);
        try {
            await deleteMovie(id);
            navigate("/movies");
        } catch (err) {
            setModalMessage("Only an admin can delete a movie.");
            setIsModalOpen(true);
        }
    };

    const handleUpdateMovie = () => {
        navigate(`/movies/update/${id}`);
    };

    const handleBackClick = () => {
        navigate("/movies");
    };

    const handleUpdateReview = async (reviewId, updatedContent) => {
        try {
            await updateReview(id, reviewId, { body: updatedContent });
    
            const updatedMovie = await fetchMovieById(id);
    
            setReviews(updatedMovie.reviews || []); 
    
            setEditingReview(null);
    
        } catch (err) {
            console.error("Error updating review:", err);
            setModalMessage("You can modify only your own reviews.");
            setIsModalOpen(true);
        }
    };

    const handleDeleteReview = async (reviewId) => {
        try {
            const result = await deleteReview(id, reviewId);
    
            if (result === null) {
                console.log("Review deleted successfully with no content returned");
            } else {
                console.log("Delete result:", result);
            }
            const updatedMovie = await fetchMovieById(id);
            console.log("Updated movie details after deletion:", updatedMovie);
            setMovie(updatedMovie);
            setReviews(updatedMovie.reviews || []);
            setModalMessage("Review deleted successfully!");
            setIsModalOpen(true);

        } catch (err) {
            console.error('Error occurred while deleting review:', err.message || err);
            setModalMessage("You can delete only your own reviews.");
            setIsModalOpen(true);

        }
    };

    const closeModal = () => setIsModalOpen(false);
    const closeDeleteConfirm = () => setIsDeleteConfirmOpen(false);
    
    
    if (error) {
        return <div className="movie-detail-error">{error}</div>;
    }

    if (!movie) {
        return <div className="movie-detail-loading">Loading...</div>;
    }

    return (
        <div className="movie-details-container">
            <button className="back-button-movie-detail" onClick={handleBackClick}>
                Back
            </button>
            <div className="movie-detail-box">
                <div className="movie-details-button">
                    <button
                        className="update-movie-button"
                        onClick={handleUpdateMovie}
                    >
                        Update Movie
                    </button>
                    <button
                        className="delete-movie-button"
                        onClick={handleDeleteMovie}
                    >
                        Delete Movie
                    </button>
                </div>
                <div className="movie-info">
                    <img
                        src={`data:image/jpeg;base64,${movie.image}`}
                        alt={movie.title}
                        className="movie-poster"
                    />
                    <div className="movie-details">
                        <h1>{movie.title}</h1>
                        <p><strong>Director:</strong> {movie.director}</p>
                        <p><strong>Year:</strong> {movie.year}</p>
                        <p><strong>Genre:</strong> {movie.genre}</p>
                        <p><strong>Rating:</strong> {movie.rating}</p>
                    </div>
                </div>
                <ReviewForm onSubmit={handleReviewSubmit} />
            </div>
            <ReviewList
                reviews={reviews}
                onEdit={setEditingReview}
                onDelete={handleDeleteReview}
                editingReview={editingReview}
                onUpdateReview={handleUpdateReview}
            />

            <Modal 
                show={isModalOpen} 
                message={modalMessage} 
                onClose={closeModal} 
            />

            <ConfirmationModal
                show={isDeleteConfirmOpen}
                message="Are you sure you want to delete this movie?"
                onConfirm={confirmDeleteMovie}
                onCancel={closeDeleteConfirm}
            />
        </div>
    );
};

export default MovieDetail;
