package io.github.nesz.server.user.post;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.github.nesz.server.user.User;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

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

    public Post() { }

    public Post(Long id, String title, String imageExtension, LocalDateTime uploadTime, User author) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.uploadTime = uploadTime;
        this.imageExtension = imageExtension;
    }

    public Post(String title, String imageExtension, LocalDateTime uploadTime, User author) {
        this.title = title;
        this.author = author;
        this.uploadTime = uploadTime;
        this.imageExtension = imageExtension;
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
}
