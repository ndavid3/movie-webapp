package com.movies.moviesapp.service;

import com.movies.moviesapp.dto.MovieDTO;
import com.movies.moviesapp.dto.ReviewDTO;
import com.movies.moviesapp.mapper.ReviewMapper;
import com.movies.moviesapp.model.Movie;
import com.movies.moviesapp.repo.MovieRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class MovieService {

    @Autowired
    private final MovieRepository movieRepository;

    @Autowired
    public MovieService(MovieRepository movieRepository) {
        this.movieRepository = movieRepository;
    }


    public List<MovieDTO> getAllMovies() {
        return movieRepository.findAll()
                .stream()
                .map(movie -> new MovieDTO(
                        movie.getId(),
                        movie.getTitle(),
                        movie.getImage()
                ))
                .collect(Collectors.toList());
    }


    public MovieDTO getMoviesById(Long id) {
        Optional<Movie> movie = movieRepository.findById(id);

        if (movie.isPresent()) {
            List<ReviewDTO> reviewDTOs = movie.get().getReviews()
                    .stream()
                    .map(ReviewMapper::toDTO)
                    .toList();

            return new MovieDTO(
                    movie.get().getId(),
                    movie.get().getTitle(),
                    movie.get().getDirector(),
                    movie.get().getYear(),
                    movie.get().getGenre(),
                    movie.get().getRating(),
                    reviewDTOs,
                    movie.get().getImage()
            );
        } else {
            return null;
        }
    }


    public void addNewMovie(Movie movie, Long userId, MultipartFile imageFile) {
        Optional<Movie> movieOptional = movieRepository.findByTitle(movie.getTitle());
        if (movieOptional.isPresent()) {
            throw new IllegalStateException("Movie already exists");
        }

        try {
            byte[] imageBytes = imageFile.getBytes();
            movie.setImage(imageBytes);
        } catch (IOException e) {
            throw new RuntimeException("Failed to convert image to byte array", e);
        }

        movieRepository.save(movie);
    }


    public void deleteMovie(Long movieId) {
        boolean exists = movieRepository.existsById(movieId);
        if (!exists) {
            throw new IllegalStateException("Movie does not exist");
        }

        movieRepository.deleteById(movieId);
    }


    @Transactional
    public Movie updateMovie(Long id, Movie updatedMovie) {
        Optional<Movie> movieOptional = movieRepository.findById(id);

        if (movieOptional.isPresent()) {
            Movie existingMovie = movieOptional.get();

            existingMovie.setTitle(updatedMovie.getTitle());
            existingMovie.setDirector(updatedMovie.getDirector());
            existingMovie.setYear(updatedMovie.getYear());
            existingMovie.setGenre(updatedMovie.getGenre());
            existingMovie.setRating(updatedMovie.getRating());
            existingMovie.setImage(updatedMovie.getImage());

            return movieRepository.save(existingMovie);
        } else {
            throw new RuntimeException("Movie with ID " + id + " not found");
        }
    }

    public Optional<Movie> getMovieById(Long movieId) {
        return movieRepository.findById(movieId);
    }
}
