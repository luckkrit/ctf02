package com.k9.backend.controllers;

import com.k9.backend.models.Queue;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
public class QueueController {
    private final SimpMessagingTemplate template;
    private List<Queue> queues = new ArrayList<>(
            Collections.singletonList(new Queue(1L, "A001"))
    );

    @MessageMapping("/queues/{id}")
    @SendTo("/topic/queues/{id}")
    public Queue getQueues(@DestinationVariable Long id){
        //        this.template.convertAndSend("/topic/queue/1",queue );
        return this.queues.stream().filter(q->
                q.getId().equals(id)).findAny().orElse(null);
    }

    @MessageMapping("/queues")
    public void getAllQueues() {
        this.template.convertAndSend("/topic/queues",queues );
    }

    @MessageMapping("/getRoomName")
    @SendTo("/topic/getRoomName")
    public UUID getRoomName(){
        return UUID.randomUUID();
    }
}
