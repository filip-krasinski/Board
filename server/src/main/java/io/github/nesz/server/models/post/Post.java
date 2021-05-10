package io.github.nesz.server.models.post;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.github.nesz.server.models.comment.Comment;
import io.github.nesz.server.models.user.User;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(length = 64)
    private String title;
    private LocalDateTime uploadTime;

    private String imagePath;

    private int imageWidth;
    private int imageHeight;

    @OneToOne
    @JsonIgnoreProperties({"posts"})
    private User author;

    @ManyToMany
    @JsonIgnoreProperties({"posts", "pinned"})
    private List<User> pinnedBy;

    @OneToMany(orphanRemoval = true)
    @JsonIgnoreProperties({"parent"})
    private List<Comment> comments;

    public Post() { }

    public Post(Long id, String title, LocalDateTime uploadTime, String imagePath,
                User author, int imageHeight, int imageWidth, List<User> pinnedBy, List<Comment> comments) {
        this.id = id;
        this.title = title;
        this.uploadTime = uploadTime;
        this.author = author;
        this.imagePath = imagePath;
        this.imageHeight = imageHeight;
        this.imageWidth = imageWidth;
        this.pinnedBy = pinnedBy;
        this.comments = comments;
    }

    public Post(String title, LocalDateTime uploadTime, String imagePath,
                User author, int imageHeight, int imageWidth, List<User> pinnedBy, List<Comment> comments) {
        this.title = title;
        this.uploadTime = uploadTime;
        this.author = author;
        this.imagePath = imagePath;
        this.imageHeight = imageHeight;
        this.imageWidth = imageWidth;
        this.pinnedBy = pinnedBy;
        this.comments = comments;
    }

    public Post(String title, LocalDateTime uploadTime, String imagePath,
                User author, int imageHeight, int imageWidth) {
        this.title = title;
        this.uploadTime = uploadTime;
        this.imagePath = imagePath;
        this.author = author;
        this.imageHeight = imageHeight;
        this.imageWidth = imageWidth;
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

    public void removePinFrom(User user) {
        this.pinnedBy.remove(user);
    }

    public String getImagePath() {
        return imagePath;
    }

    public void setImagePath(String imagePath) {
        this.imagePath = imagePath;
    }

    public int getImageWidth() {
        return imageWidth;
    }

    public void setImageWidth(int imageWidth) {
        this.imageWidth = imageWidth;
    }

    public int getImageHeight() {
        return imageHeight;
    }

    public void setImageHeight(int imageHeight) {
        this.imageHeight = imageHeight;
    }
}
