package com.k9.backend.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;

import lombok.RequiredArgsConstructor;


@CrossOrigin(origins = "*", maxAge = 3600)
@Controller
@RequiredArgsConstructor
public class MessageController {

//    private final SimpMessagingTemplate template;

    // Handles messages from /app/chat. (Note the Spring adds the /app prefix for us).
//    @MessageMapping("/chat")
    // Sends the return value of this method to /topic/messages
//    @SendTo("/topic/messages")
//    public MessageDto getMessages(MessageDto dto) {
//        return dto;
//    }

//    @SendTo("/topic/messsages")
//    public MessageDto send(MessageDto dto) {
//        return dto;
//    }

//    @PostMapping("/messages")
//    public ResponseEntity<?> addMessage(@RequestBody MessageDto messageDto) {
//        this.template.convertAndSend("/topic/messages", messageDto);
//        return new ResponseEntity<>(messageDto, HttpStatus.OK);
//    }
}
