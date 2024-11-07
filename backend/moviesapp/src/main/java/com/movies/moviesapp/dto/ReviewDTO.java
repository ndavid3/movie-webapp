package com.movies.moviesapp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReviewDTO {

    private Long id;
    private UserDTO username;
    private String body;
    private LocalDateTime created;
    private LocalDateTime updated;
}
