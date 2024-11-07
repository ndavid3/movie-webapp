package com.movies.moviesapp.service;

import com.movies.moviesapp.dto.UserDTO;
import com.movies.moviesapp.model.Users;
import com.movies.moviesapp.repo.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JWTService jwtService;

    @Autowired
    AuthenticationManager authenticationManager;

    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);


    public Users register(Users user) {
        user.setPassword(encoder.encode(user.getPassword()));
        return userRepository.save(user);
    }


    public String verify(Users user) {
        Authentication authentication =
                authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(user.getUsername(),
                        user.getPassword()));

        if (authentication.isAuthenticated()) {
            return jwtService.generateToken(user.getUsername());
        }
        return "Fail";
    }


    public List<UserDTO> getAllUsers() {
        List<Users> users = userRepository.findAll();
        return users.stream()
                .map(user -> new UserDTO(user.getId(),user.getUsername()))
                .collect(Collectors.toList());
    }


    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }


    public Users changePassword(Long userId, String newPassword) {
        Users user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        user.setPassword(encoder.encode(newPassword));

        return userRepository.save(user);
    }
}