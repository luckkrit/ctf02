package com.k9.backend.security.services;

import com.k9.backend.models.Role;
import com.k9.backend.models.User;
import com.k9.backend.security.jwt.JwtUtils;
import com.k9.backend.services.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;


@Service
public class WebSocketAuthenticatorService {

    @Autowired
    private UserService userService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authManager;

    @Autowired
    private JwtUtils jwtUtils;

    public UsernamePasswordAuthenticationToken getAuthenticatedOrFail(String token) throws AuthenticationException {

        String jwt = parseJwt(token);
        if (jwt != null && jwtUtils.validateJwtToken(jwt)) {
            String username = jwtUtils.getUserNameFromJwtToken(jwt);

            User user = this.userService.findUserByUsername(username);
            Role[] roles = new Role[user.getRoles().size()];
            user.getRoles().toArray(roles);
            List<SimpleGrantedAuthority> userRoles = Arrays.stream(roles).map(role -> new SimpleGrantedAuthority(role.
                    getRoleName().name())).collect(Collectors.toList());
            return new UsernamePasswordAuthenticationToken(
                    user.getUsername(),
                    user.getPassword(),
                    userRoles
            );
        } else {
            throw new AuthenticationCredentialsNotFoundException("User not found");
        }
    }

    private String parseJwt(String token) {

        if (StringUtils.hasText(token) && token.startsWith("Bearer ")) {
            return token.substring(7, token.length());
        }

        return null;
    }

    public UsernamePasswordAuthenticationToken getAuthenticatedOrFail(String username, String password) throws AuthenticationException {

        // Check the username and password are not empty
        if (username == null || username.trim().isEmpty()) {
            throw new AuthenticationCredentialsNotFoundException("Username was null or empty.");
        }
        if (password == null || password.trim().isEmpty()) {
            throw new AuthenticationCredentialsNotFoundException("Password was null or empty.");
        }
        // Check that the user with that username exists
        User user = userService.findUserByUsername(username);
        if (user == null) {
            throw new AuthenticationCredentialsNotFoundException("User not found");
        }
        Role[] roles = new Role[user.getRoles().size()];
        user.getRoles().toArray(roles);
        UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(
                username,
                password,
                Collections.singletonList(new SimpleGrantedAuthority(roles[0].getRoleName().name()))

        );

        // verify that the credentials are valid
        authManager.authenticate(token);

        // Erase the password in the token after verifying it because we will pass it to the STOMP headers.
        token.eraseCredentials();

        return token;
    }
}