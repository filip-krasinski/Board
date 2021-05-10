package io.github.nesz.server.authentication.info;

import io.github.nesz.server.authentication.AuthenticationProvider;

import java.util.Map;

public class OAuth2UserInfoFactory {

    public static OAuth2UserInfo getOAuth2UserInfo(String registrationId, Map<String, Object> attributes) {
        if (registrationId.equalsIgnoreCase(AuthenticationProvider.github.toString())) {
            return new OAuth2GithubUserInfo(attributes);
        }
        throw new IllegalArgumentException("Login with " + registrationId + " is not supported.");
    }

}