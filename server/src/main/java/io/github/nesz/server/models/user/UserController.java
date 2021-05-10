package io.github.nesz.server.models.user;

import io.github.nesz.server.ApiEndpoints;
import io.github.nesz.server.authentication.annotations.AuthenticatedUser;
import io.github.nesz.server.authentication.annotations.RequiresAuthenticated;
import io.github.nesz.server.models.post.Post;
import io.github.nesz.server.models.post.PostRepository;
import io.github.nesz.server.models.user.details.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(ApiEndpoints.USERS)
public class UserController {

    private final UserRepository userRepository;
    private final PostRepository postRepository;

    UserController(UserRepository userRepository, PostRepository postRepository) {
        this.userRepository = userRepository;
        this.postRepository = postRepository;
    }

    @RequiresAuthenticated
    @GetMapping("me")
    public User fetchCurrentUser(@AuthenticatedUser UserDetails userDetails) {
        return userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new IllegalArgumentException("user not found"));
    }

    @GetMapping("get")
    public User fetchById(@RequestParam Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("user not found"));
    }

    @RequiresAuthenticated
    @PostMapping("pin")
    public void pinPost(@AuthenticatedUser UserDetails details, @RequestParam Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("post not found"));

        User user = userRepository.findById(details.getId())
                .orElseThrow(() -> new IllegalArgumentException("user not found"));

        user.pinPost(post);
        post.addPinFrom(user);

        userRepository.save(user);
    }

    @RequiresAuthenticated
    @PostMapping("unpin")
    public void unpinPost(@AuthenticatedUser UserDetails details, @RequestParam Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("post not found"));

        User user = userRepository.findById(details.getId())
                .orElseThrow(() -> new IllegalArgumentException("user not found"));

        user.unpinPost(post);
        post.removePinFrom(user);
        userRepository.save(user);
        postRepository.save(post);
    }
}
