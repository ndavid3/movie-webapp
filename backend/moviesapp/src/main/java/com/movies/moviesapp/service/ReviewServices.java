package com.movies.moviesapp.service;

import com.movies.moviesapp.dto.ReviewDTO;
import com.movies.moviesapp.mapper.ReviewMapper;
import com.movies.moviesapp.model.Movie;
import com.movies.moviesapp.model.Review;
import com.movies.moviesapp.model.Users;
import com.movies.moviesapp.repo.MovieRepository;
import com.movies.moviesapp.repo.ReviewRepository;
import com.movies.moviesapp.repo.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;


@Service
public class ReviewServices {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private MovieRepository movieRepository;

    @Autowired
    private UserRepository userRepository;


    public Review createReview(Review review, Long userId, Long movieId) {
        Optional<Movie> movieOptional = movieRepository.findById(movieId);

        if (movieOptional.isPresent()) {
            Movie movie = movieOptional.get();
            review.setMovie(movie);
        } else {
            throw new RuntimeException("Movie with ID " + movieId + " not found");
        }

        Users user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        review.setCreated(LocalDateTime.now());
        review.setUpdated(LocalDateTime.now());

        review.setAddedBy(user);
        return reviewRepository.save(review);
    }


    public Optional<Review> getReviewById(Long id) {
        return reviewRepository.findById(id);
    }


    public ReviewDTO getReviewByIdForEdit(Long reviewId) {
        Optional<Review> review = reviewRepository.findById(reviewId);
            return ReviewMapper.toDTO(review.get());
    }


    public Review updateReview(Long id, Review updatedReview) {
        Optional<Review> existingReviewOptional = reviewRepository.findById(id);

        if (existingReviewOptional.isPresent()) {
            Review existingReview = existingReviewOptional.get();
            existingReview.setBody(updatedReview.getBody());
            existingReview.setUpdated(LocalDateTime.now());

            return reviewRepository.save(existingReview);
        } else {
            throw new RuntimeException("Review with ID " + id + " not found");
        }
    }


    public void deleteReview(Long id) {
        reviewRepository.deleteById(id);
    }
}
