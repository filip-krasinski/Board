package io.github.nesz.server.user.post;

import io.github.nesz.server.security.CurrentUser;
import io.github.nesz.server.security.CustomUserDetails;
import io.github.nesz.server.user.User;
import io.github.nesz.server.user.UserRepository;
import io.github.nesz.server.user.comment.Comment;
import io.github.nesz.server.user.comment.CommentRepository;
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
    private final CommentRepository commentRepository;

    @Autowired
    public PostController(PostRepository postRepository,
                          StorageService storageService,
                          UserRepository userRepository,
                          CommentRepository commentRepository) {
        this.postRepository = postRepository;
        this.storageService = storageService;
        this.userRepository = userRepository;
        this.commentRepository = commentRepository;
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

    @PostMapping("post/comments/add")
    public Comment addComment(
            @CurrentUser CustomUserDetails customUserDetails,
            @RequestParam Long postId,
            @RequestParam String content
    ) {
        User user = userRepository.findById(customUserDetails.getId())
                .orElseThrow(() -> new IllegalArgumentException("user not found"));

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("post not found"));

        Comment comment = new Comment(content, LocalDateTime.now(), post, user);

        commentRepository.save(comment);
        post.addComment(comment);
        postRepository.save(post);
        return comment;
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
        Post saved = postRepository.save(new Post(title, LocalDateTime.now(), ext, user));
        List<Post> posts = user.getPosts();
        posts.add(saved);
        userRepository.save(user);
        storageService.store(file, saved.getId() + "." + ext);
        return saved;
    }
}
