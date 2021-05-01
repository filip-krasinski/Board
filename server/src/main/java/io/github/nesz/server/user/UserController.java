package io.github.nesz.server.user;

import io.github.nesz.server.security.CurrentUser;
import io.github.nesz.server.security.CustomUserDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserController {

    private final UserRepository userRepository;

    @Autowired
    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/user/me")
    @PreAuthorize("hasRole('USER')")
    public User getCurrentUser(@CurrentUser CustomUserDetails customUserDetails) {
        return userRepository.findById(customUserDetails.getId())
                .orElseThrow(() -> new IllegalArgumentException("user not found"));
    }

    @GetMapping("user")
    public User getUser(@RequestParam Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("user not found"));
    }
}
