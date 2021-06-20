package com.k9.backend.security.websocket;

import com.k9.backend.security.services.WebSocketAuthenticatorService;

import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthChannelInterceptor implements ChannelInterceptor {

    private final WebSocketAuthenticatorService service;
    private static final String USERNAME_HEADER = "username";
    private static final String PASSWORD_HEADER = "password";
    private static final String TOKEN_HEADER = "token";


    // Processes a message before sending it
    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {

        // Instantiate an object for retrieving the STOMP headers
        final StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);
        // Check that the object is not null
        assert accessor != null;
        // If the frame is a CONNECT frame
        if (accessor.getCommand() == StompCommand.CONNECT) {

//            // retrieve the username from the headers
//            final String username = accessor.getFirstNativeHeader(USERNAME_HEADER);
//            // retrieve the password from the headers
//            final String password = accessor.getFirstNativeHeader(PASSWORD_HEADER);
            // authenticate the user and if that's successful add their user information to the headers
            final String token = accessor.getFirstNativeHeader(TOKEN_HEADER);
            UsernamePasswordAuthenticationToken user = service.getAuthenticatedOrFail(token);

            accessor.setUser(user);

        }

        return message;
    }

}
