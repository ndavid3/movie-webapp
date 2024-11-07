package com.movies.moviesapp.controller;

import com.movies.moviesapp.dto.ReviewDTO;
import com.movies.moviesapp.model.Review;
import com.movies.moviesapp.model.UserPrincipal;
import com.movies.moviesapp.service.ReviewServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Objects;
import java.util.Optional;

@RestController
@RequestMapping("/movies")
public class ReviewController {

    @Autowired
    private ReviewServices reviewService;


    @PostMapping("/{movieId}")
    public ResponseEntity<Review> createReview(@RequestBody Review review,
                                               @AuthenticationPrincipal UserPrincipal userDetails,
                                               @PathVariable Long movieId) {

        Long userId = userDetails.getId();
        Review createdReview = reviewService.createReview(review, userId, movieId);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdReview);
    }


    @GetMapping("/{movieId}/reviews/{id}")
    public ReviewDTO getReviewById(@PathVariable Long id) {
        return reviewService.getReviewByIdForEdit(id);
    }


    @PutMapping("/{movieId}/reviews/{id}")
    public ResponseEntity<Review> updateReview(@PathVariable Long id,
                                               @RequestBody Review review, Authentication authentication) {
        Optional<Review> optionalReview = reviewService.getReviewById(id);

        if (optionalReview.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Review existingReview = optionalReview.get();

        if (Objects.equals(existingReview.getAddedBy().getUsername(), authentication.getName()) ||
                authentication.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ADMIN"))) {

            Review updatedReview = reviewService.updateReview(id, review);
            return ResponseEntity.ok(updatedReview);

        } else {
            throw new SecurityException("You are not authorized to update this review");
        }
    }


    @DeleteMapping("/{movieId}/reviews/{id}")
    public ResponseEntity<Void> deleteReview(@PathVariable Long id, Authentication authentication) {
        Optional<Review> optionalReview = reviewService.getReviewById(id);

        if (optionalReview.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Review review = optionalReview.get();

        if (Objects.equals(review.getAddedBy().getUsername(), authentication.getName()) ||
                authentication.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ADMIN"))) {
            reviewService.deleteReview(id);
            return ResponseEntity.noContent().build();

        } else {
            throw new SecurityException("You are not authorized to delete this review");
        }
    }

}
