package com.k9.backend.services;

import com.k9.backend.dtos.AddCardDTO;
import com.k9.backend.dtos.UpdateCardDTO;
import com.k9.backend.models.Card;
import com.k9.backend.repository.CardRepository;
import com.k9.backend.repository.TodoRepository;

import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.function.Supplier;
import java.util.stream.Stream;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CardService {
    private final TodoRepository todoRepository;
    private final CardRepository cardRepository;

    public Card addCard(AddCardDTO addCardDTO) throws Exception {
        return this.todoRepository.findById(addCardDTO.getTodoId()).map(findTodo -> {

            Card card = new Card();
            card.setAddCardDTO(addCardDTO);
            card.setTodo(findTodo);
            this.cardRepository.save(card);
            findTodo.getCards().add(card);
            this.todoRepository.save(findTodo);
            return card;
        }).orElseThrow(() -> new Exception("Todo not found"));
    }

    public void updateCard(Long id, UpdateCardDTO updateCardDTO) {
        this.cardRepository.findById(id).ifPresent(findCard -> {
            findCard.setUpdateCardDTO(updateCardDTO);
            this.cardRepository.save(findCard);
        });
    }

    public void deleteCard(Long id) {
        this.cardRepository.findById(id).ifPresent(this.cardRepository::delete);
    }

    public void moveCard(Long todoId, Integer prev, Integer current) {

        this.todoRepository.findById(todoId).ifPresent(todo -> {
            final int[] i = {0};
            if (prev < current) {
                // drag down
                todo.getCards().stream().filter(card ->
                        card.getOrdinal() >= prev && card.getOrdinal() <= current
                ).sorted(Comparator.comparing(Card::getOrdinal)).forEach((card) -> {
                    if (i[0] == 0) {
                        card.setOrdinal(current);
                    } else {
                        card.setOrdinal(card.getOrdinal() - 1);
                    }
                    this.cardRepository.save(card);
                    i[0]++;
                });
            } else {
                // drag up
                // Use Supplier for stream to prevent stream close after first operation
                Supplier<Stream<Card>> streamSupplier = () ->
                        todo.getCards().stream().filter(card ->
                                card.getOrdinal() >= current && card.getOrdinal() <= prev
                        ).sorted(Comparator.comparing(Card::getOrdinal));
                var cardSize = streamSupplier.get().count();
                streamSupplier.get().forEach((card) -> {
                    if (i[0] == cardSize - 1) {
                        card.setOrdinal(current);
                    } else {
                        card.setOrdinal(card.getOrdinal() + 1);
                    }
                    this.cardRepository.save(card);
                    i[0]++;
                });
            }
        });
    }

    public void transferCard(Long id, Long prevTodoId, Long currentTodoId, Integer prev, Integer current) {
        // update card ordinal of previous todolist
        this.todoRepository.findById(prevTodoId).ifPresent(todo -> todo.getCards().stream().filter(card -> card.getOrdinal() > prev && card.getTodo().getId()
                .equals(prevTodoId)).sorted(Comparator.comparing(Card::getOrdinal)).forEach(card -> {
            card.setOrdinal(card.getOrdinal() - 1);
            this.cardRepository.save(card);
        }));
        // update card ordinal of current todolist
        this.todoRepository.findById(currentTodoId).ifPresent(todo -> {
            todo.getCards().stream().filter(card -> card.getOrdinal() >= current && card.getTodo().getId()
                    .equals(currentTodoId)).sorted(Comparator.comparing(Card::getOrdinal)).forEach(card -> {
                card.setOrdinal(card.getOrdinal() + 1);
                this.cardRepository.save(card);
            });
            this.cardRepository.findById(id).ifPresent(card -> {
                card.setOrdinal(current);
                card.setTodo(todo);
                this.cardRepository.save(card);
            });
        });
    }
}
