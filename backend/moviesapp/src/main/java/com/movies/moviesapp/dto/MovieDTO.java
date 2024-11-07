package com.movies.moviesapp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MovieDTO {

    private Long id;
    private String title;
    private String director;
    private Long year;
    private String genre;
    private Float rating;
    private List<ReviewDTO> reviews;
    private byte[] image;


    public MovieDTO(Long id,String title, byte[] image) {
        this.id = id;
        this.title = title;
        this.image = image;
    }
}
