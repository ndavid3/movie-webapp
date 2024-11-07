import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addMovie } from "../api";
import "./AddMovie.css";

const AddMovie = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: "",
        image: null,
        director: "",
        year: "",
        genre: "",
        rating: "",
    });
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleImageChange = (e) => {
        setFormData((prevData) => ({ ...prevData, image: e.target.files[0] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        data.append(
            "movie",
            JSON.stringify({
                title: formData.title,
                director: formData.director,
                year: formData.year,
                genre: formData.genre,
                rating: formData.rating,
            })
        );
        data.append("image", formData.image);

        try {
            await addMovie(data);
            setMessage("Movie added successfully!");
            setTimeout(() => {
                navigate("/movies", { replace: true });
            }, 2000);
        } catch (error) {
            console.error("Failed to add movie:", error);
            setMessage(
                "Failed to add movie. The picture size is too big or the movie exist."
            );
        }
    };

    const handleBack = () => {
        navigate("/movies");
    };

    return (
        <div className="add-new-movie-container">
            {" "}
            <button onClick={handleBack} className="back-button-from-nm">
                Back
            </button>{" "}
            <div className="add-new-movie-box">
                {" "}
                <h2 className="add-movie-title">Add Movie</h2>
                {message && (
                    <p
                        className={
                            message.includes("successfully")
                                ? "success-add"
                                : "error-add"
                        }
                    >
                        {message}
                    </p>
                )}{" "}
                <form onSubmit={handleSubmit} className="add-movie-form">
                    <label htmlFor="title">Title</label>
                    <input
                        type="text"
                        name="title"
                        id="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Title"
                        required
                    />
                    <label htmlFor="image">Image</label>
                    <input
                        type="file"
                        name="image"
                        id="image"
                        onChange={handleImageChange}
                        required
                    />
                    <label htmlFor="director">Director (optional)</label>
                    <input
                        type="text"
                        name="director"
                        id="director"
                        value={formData.director}
                        onChange={handleChange}
                    />
                    <label htmlFor="year">Year (optional)</label>
                    <input
                        type="number"
                        name="year"
                        id="year"
                        value={formData.year}
                        onChange={handleChange}
                    />
                    <label htmlFor="genre">Genre (optional)</label>
                    <input
                        type="text"
                        name="genre"
                        id="genre"
                        value={formData.genre}
                        onChange={handleChange}
                    />
                    <label htmlFor="rating">Rating (optional)</label>
                    <input
                        type="number"
                        name="rating"
                        id="rating"
                        value={formData.rating}
                        onChange={handleChange}
                        min="0"
                        max="10"
                        step="0.1"
                    />
                    <div className="add-new-movie-button-div">
                        {" "}
                        <button type="submit" className="add-new-movie-button">
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddMovie;
