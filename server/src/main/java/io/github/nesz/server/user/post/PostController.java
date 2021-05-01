package io.github.nesz.server.user.post;

import io.github.nesz.server.security.CurrentUser;
import io.github.nesz.server.security.CustomUserDetails;
import io.github.nesz.server.user.User;
import io.github.nesz.server.user.UserRepository;
import io.github.nesz.server.user.storage.StorageService;
import io.github.nesz.server.util.FileUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
public class PostController {

    private final PostRepository postRepository;
    private final StorageService storageService;
    private final UserRepository userRepository;

    @Autowired
    public PostController(PostRepository postRepository, StorageService storageService, UserRepository userRepository) {
        this.postRepository = postRepository;
        this.storageService = storageService;
        this.userRepository = userRepository;
    }

    @GetMapping("post")
    public Post getPost(@RequestParam Long id) {
        return postRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("post not found"));
    }

    @GetMapping("post/get")
    public Page<Post> getPosts(PostPage page) {
        Pageable pageable = PageRequest.of(
                page.getPageNumber(),
                page.getPageSize(),
                Sort.by("id").descending()
        );
        return postRepository.findAll(pageable);
    }

    @PostMapping("post/add")
    public Post addPost(
            @RequestParam String title,
            @RequestParam("file") MultipartFile file,
            @CurrentUser CustomUserDetails customUserDetails
    ) {
        User user = userRepository.findById(customUserDetails.getId())
                .orElseThrow(() -> new IllegalArgumentException("user not found"));


        String ext = FileUtils.getExtension(file.getOriginalFilename());
        Post saved = postRepository.save(new Post(title, ext, LocalDateTime.now(), user));
        List<Post> posts = user.getPosts();
        posts.add(saved);
        userRepository.save(user);
        storageService.store(file, saved.getId() + "." + ext);
        return saved;
    }
}
