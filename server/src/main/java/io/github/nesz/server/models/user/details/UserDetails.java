package io.github.nesz.server.models.user.details;

import io.github.nesz.server.models.user.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.Collection;
import java.util.Collections;
import java.util.Map;

public class UserDetails implements OAuth2User, org.springframework.security.core.userdetails.UserDetails {

    private final Long id;
    private final String email;
    private Map<String, Object> attributes;
    private final Collection<? extends GrantedAuthority> authorities;

    public UserDetails(Long id, String email, Collection<? extends GrantedAuthority> authorities) {
        this.id = id;
        this.email = email;
        this.authorities = authorities;
    }

    public static UserDetails create(User user) {
        return new UserDetails(
            user.getId(),
            user.getEmail(),
            Collections.singleton(new SimpleGrantedAuthority("ROLE_USER"))
        );
    }

    public static UserDetails create(User user, Map<String, Object> attributes) {
        UserDetails userDetails = UserDetails.create(user);
        userDetails.setAttributes(attributes);
        return userDetails;
    }

    public Long getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    @Override
    public String getPassword() {
        return null;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public Map<String, Object> getAttributes() {
        return attributes;
    }

    @Override
    public String getName() {
        return String.valueOf(id);
    }

    public void setAttributes(Map<String, Object> attributes) {
        this.attributes = attributes;
    }

}