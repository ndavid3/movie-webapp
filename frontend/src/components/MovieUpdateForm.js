import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchMovieById, updateMovie } from '../api';
import './MovieUpdateForm.css';

const MovieUpdateForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [movie, setMovie] = useState({
        title: '',
        director: '',
        year: '',
        genre: '',
        rating: '',
    });
    const [imageFile, setImageFile] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getMovie = async () => {
            try {
                const movieData = await fetchMovieById(id);
                setMovie(movieData);
            } catch (err) {
                setError('Failed to fetch movie data');
            }
        };
        getMovie();
    }, [id]);

    const handleChange = (e) => {
        setMovie({ ...movie, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        setImageFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('movie', JSON.stringify(movie));
        if (imageFile) {
            formData.append('image', imageFile);
        }

        try {
            await updateMovie(id, formData);
            navigate(`/movies/${id}`, { replace: true });
        } catch (err) {
            setError('Failed to update movie');
        }
    };

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <div className="update-movie-container">
            <button onClick={handleBack} className="update-movie-back-button">Back</button>
            <div className="update-movie-box">
                <h2>Update Movie</h2>
                {error && <p className="add-movie-error">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <label htmlFor="title">Title</label>
                    <input type="text" id="title" name="title" value={movie.title} onChange={handleChange} />
                    
                    <label htmlFor="director">Director</label>
                    <input type="text" id="director" name="director" value={movie.director} onChange={handleChange} />
                    
                    <label htmlFor="year">Year</label>
                    <input type="number" id="year" name="year" value={movie.year} onChange={handleChange} />
                    
                    <label htmlFor="genre">Genre</label>
                    <input type="text" id="genre" name="genre" value={movie.genre} onChange={handleChange} />
                    
                    <label htmlFor="rating">Rating</label>
                    <input type="number" id="rating" name="rating" value={movie.rating} onChange={handleChange} />
                    
                    <label htmlFor="image">Image</label>
                    <input type="file" id="image" onChange={handleImageChange} accept="image/*" />
                    
                    <div className="update-movie-button-div">
                        <button type="submit" className="update-details-button">Update Movie</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MovieUpdateForm;
