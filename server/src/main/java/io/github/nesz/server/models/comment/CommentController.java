package io.github.nesz.server.models.comment;

import io.github.nesz.server.ApiEndpoints;
import io.github.nesz.server.authentication.annotations.AuthenticatedUser;
import io.github.nesz.server.authentication.annotations.RequiresAuthenticated;
import io.github.nesz.server.exceptions.UnauthorizedOperationException;
import io.github.nesz.server.models.post.Post;
import io.github.nesz.server.models.post.PostRepository;
import io.github.nesz.server.models.user.User;
import io.github.nesz.server.models.user.UserRepository;
import io.github.nesz.server.models.user.details.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping(ApiEndpoints.COMMENTS)
public class CommentController {

    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final CommentRepository commentRepository;


    CommentController(PostRepository postRepository, UserRepository userRepository, CommentRepository commentRepository) {
        this.postRepository = postRepository;
        this.userRepository = userRepository;
        this.commentRepository = commentRepository;
    }

    @RequiresAuthenticated
    @PostMapping("add")
    public Comment addComment(
            @AuthenticatedUser UserDetails userDetails,
            @RequestParam Long postId,
            @RequestParam String content) {

        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("Post not found"));

        if (content.length() > 512)
            throw new IllegalArgumentException("Comment is too long");

        Comment comment = new Comment(content, LocalDateTime.now(), post, user);

        commentRepository.save(comment);
        post.addComment(comment);
        postRepository.save(post);
        return comment;
    }

    @RequiresAuthenticated
    @DeleteMapping("delete")
    public void deleteComment(
            @AuthenticatedUser UserDetails userDetails,
            @RequestParam Long id) {

        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Comment not found"));

        if (!user.getId().equals(comment.getAuthor().getId())) {
            throw new UnauthorizedOperationException("Cannot delete comment of another author");
        }

        commentRepository.delete(comment);
    }

}
