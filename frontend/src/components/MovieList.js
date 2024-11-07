import React, { useEffect, useState } from 'react';
import { fetchMovies, fetchUsers } from '../api'; 
import { Link, useNavigate } from 'react-router-dom';
import './MovieList.css';
import Modal from "./Modal";

const MovieList = () => {
    const [movies, setMovies] = useState([]);
    const [error] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOrder, setSortOrder] = useState('asc');
    const moviesPerPage = 14;
    const navigate = useNavigate();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState("");

    useEffect(() => {
        const getMovies = async () => {
            try {
                const moviesData = await fetchMovies();
                setMovies(moviesData);
            } catch (err) {
                console.error("Error fetching movies:", err);
            }
        };

        getMovies();
    }, []);

    if (error) {
        return <div>{error}</div>;
    }
    const filteredMovies = movies.filter(movie =>
        movie.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sortedMovies = [...filteredMovies].sort((a, b) => {
        if (sortOrder === 'asc') {
            return a.title.localeCompare(b.title);
        } else {
            return b.title.localeCompare(a.title);
        }
    });

    const indexOfLastMovie = currentPage * moviesPerPage;
    const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
    const currentMovies = sortedMovies.slice(indexOfFirstMovie, indexOfLastMovie);
    const totalPages = Math.ceil(sortedMovies.length / moviesPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleAddMovie = () => {
        navigate('/add-movie');
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const handleSortChange = (e) => {
        setSortOrder(e.target.value); 
    };

    const handleUserButtonClick = async () => {
        try {
            const usersData = await fetchUsers();
            if (usersData) {
                navigate('/users');
            }
        } catch (err) {
            setModalMessage("You are not authorized to see the users list.");
            setIsModalOpen(true);
            console.error('Error fetching users:', err);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="movie-list-container">
            <button className="users-list-button" onClick={handleUserButtonClick}>
                Users
            </button>
            
            <input
                type="text"
                placeholder="Search for a movie..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="search-bar"
            />
            <select onChange={handleSortChange} value={sortOrder} className="sort-dropdown">
                <option value="asc">Sort by Title (A-Z)</option>
                <option value="desc">Sort by Title (Z-A)</option>
            </select>
            <div className="movie-list">
                {currentMovies.map((movie) => (
                    <Link to={`/movies/${movie.id}`} key={movie.id}>
                        <img src={`data:image/jpeg;base64,${movie.image}`} alt={movie.title} />
                    </Link>
                ))}
            </div>
            <div className="pagination">
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index + 1}
                        onClick={() => handlePageChange(index + 1)}
                        disabled={index + 1 === currentPage}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
            <button onClick={handleAddMovie} className="add-movie-button">
                Add Movie
            </button>
            <Modal 
                show={isModalOpen} 
                message={modalMessage} 
                onClose={closeModal} 
            />
        </div>
    );
};

export default MovieList;
