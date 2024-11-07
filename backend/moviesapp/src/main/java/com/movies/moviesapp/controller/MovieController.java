package com.movies.moviesapp.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.movies.moviesapp.dto.MovieDTO;
import com.movies.moviesapp.model.Movie;
import com.movies.moviesapp.model.UserPrincipal;
import com.movies.moviesapp.service.MovieService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping(path = "/movies")
public class MovieController {

    private final MovieService movieService;


    @Autowired
    public MovieController(MovieService movieService) {
        this.movieService = movieService;
    }


    @GetMapping
    public List<MovieDTO> getAllMovies() {
        return movieService.getAllMovies();
    }


    @GetMapping("/{id}")
    public MovieDTO getMovieById(@PathVariable Long id) {
        return movieService.getMoviesById(id);
    }


    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<Void> registerNewMovie(
            @RequestParam("movie") String movieJson,
            @RequestParam("image") MultipartFile imageFile,
            @AuthenticationPrincipal UserPrincipal userDetails) {

        Long userId = userDetails.getId();
        Movie movie = convertJsonToMovie(movieJson);
        movieService.addNewMovie(movie, userId, imageFile);

        return new ResponseEntity<>(HttpStatus.CREATED);
    }


    private Movie convertJsonToMovie(String json) {
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            return objectMapper.readValue(json, Movie.class);
        } catch (IOException e) {
            throw new RuntimeException("Failed to convert JSON to Movie", e);
        }
    }


    @DeleteMapping("/{movieId}")
    public ResponseEntity<Void> deleteMovie(@PathVariable Long movieId, Authentication authentication) {
        Optional<Movie> optionalMovie = movieService.getMovieById(movieId);

        if (optionalMovie.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        if (authentication.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ADMIN"))) {
            movieService.deleteMovie(movieId);
            return ResponseEntity.noContent().build();
        } else {
            throw new SecurityException("You are not authorized to delete this movie");
        }
    }


    @PutMapping(value = "/{movieId}", consumes = {"multipart/form-data"})
    public ResponseEntity<Movie> updateMovie(
            @PathVariable Long movieId,
            @RequestParam("movie") String movieJson,
            @RequestParam(value = "image", required = false) MultipartFile imageFile,
            Authentication authentication) {

        Optional<Movie> optionalMovie = movieService.getMovieById(movieId);

        if (optionalMovie.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Movie existingMovie = optionalMovie.get();

        Movie updatedMovie = convertJsonToMovie(movieJson);

        existingMovie.setTitle(updatedMovie.getTitle());
        existingMovie.setDirector(updatedMovie.getDirector());
        existingMovie.setYear(updatedMovie.getYear());
        existingMovie.setGenre(updatedMovie.getGenre());
        existingMovie.setRating(updatedMovie.getRating());

        if (imageFile != null && !imageFile.isEmpty()) {
            try {
                byte[] imageBytes = imageFile.getBytes();
                existingMovie.setImage(imageBytes);
            } catch (IOException e) {
                throw new RuntimeException("Failed to convert image to byte array", e);
            }
        }

        Movie savedMovie = movieService.updateMovie(movieId, existingMovie);
        return ResponseEntity.ok(savedMovie);
    }
}
