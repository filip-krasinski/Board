package io.github.nesz.server.security.info;

import io.github.nesz.server.user.AuthProvider;

import java.util.Map;

public class OAuth2UserInfoFactory {

    public static OAuth2UserInfo getOAuth2UserInfo(String registrationId, Map<String, Object> attributes) {
        if (registrationId.equalsIgnoreCase(AuthProvider.github.toString())) {
            return new GithubOAuth2UserInfo(attributes);
        }
        throw new IllegalArgumentException("Sorry! Login with " + registrationId + " is not supported.");
    }
}
