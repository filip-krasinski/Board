package io.github.nesz.server.models.post;

import io.github.nesz.server.ApiEndpoints;
import io.github.nesz.server.authentication.annotations.AuthenticatedUser;
import io.github.nesz.server.authentication.annotations.RequiresAuthenticated;
import io.github.nesz.server.exceptions.UnauthorizedOperationException;
import io.github.nesz.server.models.storage.StorageService;
import io.github.nesz.server.models.user.User;
import io.github.nesz.server.models.user.UserRepository;
import io.github.nesz.server.models.user.details.UserDetails;
import io.github.nesz.server.util.FileUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.util.Pair;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.UUID;

@RestController
@RequestMapping(ApiEndpoints.POSTS)
public class PostController {

    private final PostRepository postRepository;
    private final StorageService storageService;
    private final UserRepository userRepository;

    PostController(PostRepository postRepository,
                   StorageService storageService,
                   UserRepository userRepository) {
        this.postRepository = postRepository;
        this.storageService = storageService;
        this.userRepository = userRepository;
    }

    @GetMapping("get")
    public Post fetchPost(@RequestParam Long id) {
        return postRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("post not found"));
    }

    @GetMapping("list")
    public Page<Post> getPosts(PostPage page) {
        Pageable pageable = PageRequest.of(
                page.getPageNumber(),
                page.getPageSize(),
                Sort.by("id").descending()
        );
        return postRepository.findAll(pageable);
    }

    @RequiresAuthenticated
    @DeleteMapping("delete")
    public void deletePost(
            @AuthenticatedUser UserDetails userDetails,
            @RequestParam Long id) {

        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Post post = postRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Post not found"));

        if (!user.getId().equals(post.getAuthor().getId())) {
            throw new UnauthorizedOperationException("Cannot delete post of another author");
        }

        postRepository.delete(post);
    }

    @RequiresAuthenticated
    @PostMapping("add")
    public Post addPost(
            @RequestParam String title,
            @RequestParam("file") MultipartFile file,
            @AuthenticatedUser UserDetails userDetails
    ) {
        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new IllegalArgumentException("user not found"));

        if (title.length() > 64)
            throw new IllegalArgumentException("Title is too long");

        String ext = FileUtils.getExtension(file.getOriginalFilename());
        String filename = UUID.randomUUID() + "." + ext;

        Pair<Integer, Integer> imageData = FileUtils.parseImage(file)
                .orElseThrow(() -> new IllegalArgumentException("Invalid image file"));

        storageService.store(file, filename);

        Post saved = postRepository.save(new Post(
            title, LocalDateTime.now(), filename, user,
            imageData.getFirst(), imageData.getSecond())
        );

        user.addPost(saved);

        userRepository.save(user);
        return saved;
    }

}
