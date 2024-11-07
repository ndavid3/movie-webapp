package com.movies.moviesapp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserDTO {
    private Long id;
    private String username;

    public UserDTO(String username) {
        this.username = username;
    }
}
