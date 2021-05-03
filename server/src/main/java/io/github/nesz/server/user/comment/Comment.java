package io.github.nesz.server.user.comment;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.github.nesz.server.user.User;
import io.github.nesz.server.user.post.Post;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(length = 512)
    private String content;
    private LocalDateTime creationTime;
    @OneToOne
    @JsonIgnoreProperties({"author"})
    private Post parent;
    @OneToOne
    @JsonIgnoreProperties({"posts", "pinned"})
    private User author;

    public Comment() { }

    public Comment(String content, LocalDateTime creationTime, Post parent, User author) {
        this.content = content;
        this.creationTime = creationTime;
        this.parent = parent;
        this.author = author;
    }

    public Comment(Long id, String content, LocalDateTime creationTime, Post parent, User author) {
        this.id = id;
        this.content = content;
        this.creationTime = creationTime;
        this.parent = parent;
        this.author = author;
    }


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public LocalDateTime getCreationTime() {
        return creationTime;
    }

    public void setCreationTime(LocalDateTime creationTime) {
        this.creationTime = creationTime;
    }

    public Post getParent() {
        return parent;
    }

    public void setParent(Post parent) {
        this.parent = parent;
    }

    public User getAuthor() {
        return author;
    }

    public void setAuthor(User author) {
        this.author = author;
    }
}
