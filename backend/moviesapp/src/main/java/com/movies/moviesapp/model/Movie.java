package com.movies.moviesapp.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.StringJoiner;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "movies")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Movie {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "movie_id")
    private Long id;

    @Column(name = "title")
    private String title;

    @Column(name = "director")
    private String director;

    @Column(name = "year")
    private Long year;

    @Column(name = "genre")
    private String genre;

    @Column(name = "rating")
    private Float rating;

    @Column(name = "image")
    private byte[] image;


    @JsonIgnore
    @OneToMany(mappedBy = "movie", cascade = CascadeType.ALL,
            orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Review> reviews;

    public Movie(String title, String director, Long year, String genre, Float rating) {
        this.title = title;
        this.director = director;
        this.year = year;
        this.genre = genre;
        this.rating = rating;
    }

    @Override
    public String toString() {
        return new StringJoiner(", ", Movie.class.getSimpleName() + "[", "]")
                .add("id=" + id)
                .add("title='" + title + "'")
                .add("director='" + director + "'")
                .add("year=" + year)
                .add("genre='" + genre + "'")
                .add("rating=" + rating)
                .toString();
    }
}
