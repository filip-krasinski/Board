package io.github.nesz.server.user;

import com.fasterxml.jackson.annotation.*;
import io.github.nesz.server.user.post.Post;
import net.minidev.json.annotate.JsonIgnore;

import javax.persistence.*;
import java.util.List;

@Entity
@Table(uniqueConstraints = {
    @UniqueConstraint(columnNames = "email")
})
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String email;
    private String avatarUrl;
    @Enumerated(EnumType.STRING)
    private AuthProvider authProvider;

    @OneToMany
    @JsonIgnoreProperties({"author"})
    private List<Post> posts;

    @OneToMany
    @JsonIgnoreProperties({"author"})
    private List<Post> pinned;


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }

    public AuthProvider getAuthProvider() {
        return authProvider;
    }

    public void setAuthProvider(AuthProvider authProvider) {
        this.authProvider = authProvider;
    }

    public List<Post> getPosts() {
        return posts;
    }

    public void setPosts(List<Post> posts) {
        this.posts = posts;
    }

    public void addPost(Post post) {
        this.posts.add(post);
    }

    public List<Post> getPinned() {
        return pinned;
    }

    public void pinPost(Post post) {
        this.pinned.add(post);
    }

    public void unpinPost(Post post) {
        this.pinned.add(post);
    }

    public void setPinned(List<Post> pinned) {
        this.pinned = pinned;
    }
}
