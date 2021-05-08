package io.github.nesz.server.security;

import io.github.nesz.server.exceptions.OAuth2AuthException;
import io.github.nesz.server.security.info.OAuth2UserInfo;
import io.github.nesz.server.security.info.OAuth2UserInfoFactory;
import io.github.nesz.server.user.AuthProvider;
import io.github.nesz.server.user.User;
import io.github.nesz.server.user.UserRepository;
import net.minidev.json.JSONArray;
import net.minidev.json.JSONObject;
import net.minidev.json.parser.JSONParser;
import net.minidev.json.parser.ParseException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.json.GsonJsonParser;
import org.springframework.security.authentication.InternalAuthenticationServiceException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {


    private final UserRepository userRepository;

    @Autowired
    public CustomOAuth2UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public OAuth2User loadUser(OAuth2UserRequest oAuth2UserRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(oAuth2UserRequest);

        try {
            return processOAuth2User(oAuth2UserRequest, oAuth2User);
        } catch (AuthenticationException ex) {
            throw ex;
        } catch (Exception ex) {
            ex.printStackTrace();
            // Throwing an instance of AuthenticationException will trigger the OAuth2AuthenticationFailureHandler
            throw new InternalAuthenticationServiceException(ex.getMessage(), ex.getCause());
        }
    }

    private OAuth2User processOAuth2User(OAuth2UserRequest oAuth2UserRequest, OAuth2User oAuth2User)
            throws URISyntaxException, IOException, InterruptedException, ParseException {

        String registrationId = oAuth2UserRequest.getClientRegistration().getRegistrationId();
        OAuth2UserInfo oAuth2UserInfo = OAuth2UserInfoFactory.getOAuth2UserInfo(
            registrationId,
            oAuth2User.getAttributes()
        );

        /*
            Since github refuses to give us an email while authorizing,
            we have to make an additional request with access token in order
            to get it.
         */
        if (oAuth2UserInfo.getEmail() == null || oAuth2UserInfo.getEmail().isEmpty()) {
            if (!oAuth2UserRequest.getClientRegistration().getRegistrationId().equalsIgnoreCase(AuthProvider.github.name())) {
                throw new OAuth2AuthException("Email not found from OAuth2 provider");
            }
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(new URI("https://api.github.com/user/emails"))
                    .header("Authorization", "Bearer " + oAuth2UserRequest.getAccessToken().getTokenValue())
                    .GET()
                    .build();

            String body = HttpClient.newHttpClient()
                    .send(request, HttpResponse.BodyHandlers.ofString())
                    .body();

            JSONParser parser = new JSONParser(JSONParser.MODE_JSON_SIMPLE);
            JSONArray parse = (JSONArray) parser.parse(body);
            String email = parse.stream()
                    .filter(obj -> (boolean) ((JSONObject) obj).get("primary"))
                    .map(obj -> ((JSONObject) obj).getAsString("email"))
                    .findAny()
                    .orElseThrow(() -> new OAuth2AuthException("Email not found from OAuth2 provider"));

            Map<String, Object> attrs = new HashMap<>(oAuth2UserInfo.getAttributes());
            attrs.put("email", email);
            oAuth2UserInfo = OAuth2UserInfoFactory.getOAuth2UserInfo(
                    registrationId,
                    Collections.unmodifiableMap(attrs)
            );
       }

        Optional<User> userOptional = userRepository.findByEmail(oAuth2UserInfo.getEmail());
        User user;

        if (userOptional.isEmpty()) {
            user = registerNewUser(oAuth2UserRequest, oAuth2UserInfo);
        } else {
            user = userOptional.get();
            if (!user.getAuthProvider().equals(AuthProvider.valueOf(registrationId))) {
                throw new OAuth2AuthException(String.format(
                        "Looks like you're signed up with %s account. Please use your %s account to login.",
                        user.getAuthProvider().name(), user.getAuthProvider().name()
                ));
            }
            user = updateExistingUser(user, oAuth2UserInfo);
        }

        return CustomUserDetails.create(user, oAuth2UserInfo.getAttributes());
    }

    private User registerNewUser(OAuth2UserRequest oAuth2UserRequest, OAuth2UserInfo oAuth2UserInfo) {
        User user = new User();

        user.setAuthProvider(AuthProvider.valueOf(oAuth2UserRequest.getClientRegistration().getRegistrationId()));
        user.setName(oAuth2UserInfo.getName());
        user.setEmail(oAuth2UserInfo.getEmail());
        user.setAvatarUrl(oAuth2UserInfo.getImageUrl());
        return userRepository.save(user);
    }

    private User updateExistingUser(User existingUser, OAuth2UserInfo oAuth2UserInfo) {
        existingUser.setName(oAuth2UserInfo.getName());
        existingUser.setEmail(oAuth2UserInfo.getEmail());
        existingUser.setAvatarUrl(oAuth2UserInfo.getImageUrl());
        return userRepository.save(existingUser);
    }

}