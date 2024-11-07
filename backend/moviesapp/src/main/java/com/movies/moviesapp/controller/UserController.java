package com.movies.moviesapp.controller;

import com.movies.moviesapp.dto.PasswordChangeRequest;
import com.movies.moviesapp.dto.UserDTO;
import com.movies.moviesapp.model.Role;
import com.movies.moviesapp.model.Users;
import com.movies.moviesapp.repo.UserRepository;
import com.movies.moviesapp.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Objects;

@RestController
public class UserController {

    private static final String ADMIN_SECRET = "nemmutatommeg";

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;


    @PostMapping("/register")
    public Users register(@RequestBody Users user) {
        if (Objects.equals(user.getRole(), Role.ADMIN) && !user.getSecret().equals(ADMIN_SECRET)) {
            throw new IllegalArgumentException("Invalid admin secret provided");
        }
        return userService.register(user);
    }


    @PostMapping("/login")
    public String login(@RequestBody Users user) {
        return userService.verify(user);
    }


    @GetMapping("/userlist")
    public List<UserDTO> getAllUsers() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication != null && authentication.getAuthorities().stream()
                .anyMatch(grantedAuthority -> grantedAuthority.getAuthority().equals("ADMIN"))) {
            return userService.getAllUsers();
        } else {
            throw new AccessDeniedException("You do not have permission to access this resource.");
        }
    }


    @DeleteMapping("/userlist/{userId}")
    public ResponseEntity<String> deleteUser(@PathVariable long userId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String authenticatedUsername = authentication.getName();

        Users authenticatedUser = userRepository.findByUsername(authenticatedUsername);

        if (authenticatedUser != null && authenticatedUser.getId().equals(userId)) {
            return ResponseEntity.badRequest().body("You cannot delete your own account.");
        }
        if (authentication.getAuthorities().stream()
                .anyMatch(grantedAuthority -> grantedAuthority.getAuthority().equals("ADMIN"))) {

            userService.deleteUser(userId);
            return ResponseEntity.noContent().build();
        }
        else throw new AccessDeniedException("You do not have permission to access this resource.");
    }


    @PostMapping("/userlist/{userId}")
    public Users changePassword(@PathVariable Long userId, @RequestBody PasswordChangeRequest passwordChangeRequest) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication.getAuthorities().stream()
                .anyMatch(grantedAuthority -> grantedAuthority.getAuthority().equals("ADMIN"))) {
                    return userService.changePassword(
                    userId,
                    passwordChangeRequest.getNewPassword());
        }
        else throw new AccessDeniedException("You do not have permission to access this resource.");
    }
}
