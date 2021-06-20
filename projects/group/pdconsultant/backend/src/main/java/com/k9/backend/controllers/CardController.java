package com.k9.backend.controllers;

import com.k9.backend.dtos.AddCardDTO;
import com.k9.backend.dtos.UpdateCardDTO;
import com.k9.backend.models.Card;
import com.k9.backend.services.CardService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/cards")
public class CardController {
    private final CardService cardService;

    @PostMapping("")
    public ResponseEntity<Card> addCard(@RequestBody AddCardDTO addCardDTO) {
        try {
            Card card = this.cardService.addCard(addCardDTO);
            return new ResponseEntity<>(card, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateCard(@PathVariable Long id, @RequestBody UpdateCardDTO updateCardDTO) {
        this.cardService.updateCard(id, updateCardDTO);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PutMapping("/move/{todoId}/{prev}/{current}")
    public ResponseEntity<?> moveCard(@PathVariable Long todoId, @PathVariable Integer prev, @PathVariable Integer current) {
        this.cardService.moveCard(todoId, prev, current);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PutMapping("/transfer/{id}/{prevTodoId}/{currentTodoId}/{prev}/{current}")
    public ResponseEntity<?> transferCard(@PathVariable Long id, @PathVariable Long prevTodoId, @PathVariable Long currentTodoId, @PathVariable Integer prev, @PathVariable Integer current) {
        this.cardService.transferCard(id, prevTodoId, currentTodoId, prev, current);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCard(@PathVariable Long id) {
        this.cardService.deleteCard(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
