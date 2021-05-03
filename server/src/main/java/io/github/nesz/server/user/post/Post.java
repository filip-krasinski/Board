package io.github.nesz.server.user.post;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.github.nesz.server.user.User;
import io.github.nesz.server.user.comment.Comment;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Entity
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    private LocalDateTime uploadTime;
    @JsonIgnore
    private String imageExtension;

    @OneToOne
    @JsonIgnoreProperties({"posts"})
    private User author;

    @ManyToMany
    @JsonIgnoreProperties({"posts", "pinned"})
    private List<User> pinnedBy;

    @OneToMany
    @JsonIgnoreProperties({"parent"})
    private List<Comment> comments;

    public Post() { }

    public Post(Long id, String title, LocalDateTime uploadTime, String imageExtension,
                User author, List<User> pinnedBy, List<Comment> comments) {
        this.id = id;
        this.title = title;
        this.uploadTime = uploadTime;
        this.imageExtension = imageExtension;
        this.author = author;
        this.pinnedBy = pinnedBy;
        this.comments = comments;
    }

    public Post(String title, LocalDateTime uploadTime, String imageExtension,
                User author, List<User> pinnedBy, List<Comment> comments) {
        this.title = title;
        this.uploadTime = uploadTime;
        this.imageExtension = imageExtension;
        this.author = author;
        this.pinnedBy = pinnedBy;
        this.comments = comments;
    }

    public Post(String title, LocalDateTime uploadTime, String imageExtension, User author) {
        this.title = title;
        this.uploadTime = uploadTime;
        this.imageExtension = imageExtension;
        this.author = author;
        this.pinnedBy = new ArrayList<>();
        this.comments = new ArrayList<>();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    @Transactional
    public String getImagePath() {
        return id + "." + imageExtension;
    }

    public String getImageExtension() {
        return imageExtension;
    }

    public void setImageExtension(String imageExtension) {
        this.imageExtension = imageExtension;
    }

    public User getAuthor() {
        return author;
    }

    public void setAuthor(User author) {
        this.author = author;
    }

    public LocalDateTime getUploadTime() {
        return uploadTime;
    }

    public void setUploadTime(LocalDateTime uploadTime) {
        this.uploadTime = uploadTime;
    }

    public List<Comment> getComments() {
        return comments;
    }

    public void addComment(Comment comment) {
        this.comments.add(comment);
    }

    public void setComments(List<Comment> comments) {
        this.comments = comments;
    }

    public List<User> getPinnedBy() {
        return pinnedBy;
    }

    public void setPinnedBy(List<User> pinnedBy) {
        this.pinnedBy = pinnedBy;
    }

    public void addPinFrom(User user) {
        this.pinnedBy.add(user);
    }
}
