package io.github.nesz.server.exceptions;

import org.springframework.security.core.AuthenticationException;

public class OAuth2AuthException extends AuthenticationException {

    public OAuth2AuthException(String msg, Throwable t) {
        super(msg, t);
    }

    public OAuth2AuthException(String msg) {
        super(msg);
    }

}
