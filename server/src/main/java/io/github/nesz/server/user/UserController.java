package io.github.nesz.server.user;

import io.github.nesz.server.security.CurrentUser;
import io.github.nesz.server.security.CustomUserDetails;
import io.github.nesz.server.user.post.Post;
import io.github.nesz.server.user.post.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserController {

    private final UserRepository userRepository;
    private final PostRepository postRepository;

    @Autowired
    public UserController(UserRepository userRepository, PostRepository postRepository) {
        this.userRepository = userRepository;
        this.postRepository = postRepository;
    }

    @GetMapping("/user/me")
    @PreAuthorize("hasRole('USER')")
    public User getCurrentUser(@CurrentUser CustomUserDetails details) {
        return userRepository.findById(details.getId())
                .orElseThrow(() -> new IllegalArgumentException("user not found"));
    }

    @GetMapping("user")
    public User getUser(@RequestParam Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("user not found"));
    }

    @PostMapping("user/pin")
    public void pinPost(@CurrentUser CustomUserDetails details, @RequestParam Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("post not found"));

        User user = userRepository.findById(details.getId())
                .orElseThrow(() -> new IllegalArgumentException("user not found"));

        user.pinPost(post);
        post.addPinFrom(user);
        userRepository.save(user);
    }

    @PostMapping("user/unpin")
    public void unpinPost(@CurrentUser CustomUserDetails details, @RequestParam Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("post not found"));

        User user = userRepository.findById(details.getId())
                .orElseThrow(() -> new IllegalArgumentException("user not found"));

        user.unpinPost(post);
        userRepository.save(user);
    }
}
