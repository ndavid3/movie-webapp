package com.movies.moviesapp.mapper;

import com.movies.moviesapp.dto.ReviewDTO;
import com.movies.moviesapp.dto.UserDTO;
import com.movies.moviesapp.model.Review;

public class ReviewMapper {
    public static ReviewDTO toDTO(Review review) {
        if (review == null) {
            return null;
        }

        ReviewDTO reviewDTO = new ReviewDTO();
        reviewDTO.setUsername(new UserDTO(review.getAddedBy().getUsername()));
        reviewDTO.setId(review.getId());
        reviewDTO.setBody(review.getBody());
        reviewDTO.setCreated(review.getCreated());
        reviewDTO.setUpdated(review.getUpdated());

        return reviewDTO;
    }
}
