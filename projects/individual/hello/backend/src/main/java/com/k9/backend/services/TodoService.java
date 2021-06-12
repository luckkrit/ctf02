package com.k9.backend.services;

import com.k9.backend.dtos.AddTodoDTO;
import com.k9.backend.dtos.UpdateTodoDTO;
import com.k9.backend.models.Todo;
import com.k9.backend.repository.BoardRepository;
import com.k9.backend.repository.CardRepository;
import com.k9.backend.repository.TodoRepository;

import org.springframework.stereotype.Service;

import java.util.Comparator;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TodoService {
    private final TodoRepository todoRepository;
    private final BoardRepository boardRepository;
    private final CardRepository cardRepository;

    public Todo addTodo(AddTodoDTO addTodoDTO) throws Exception {
        return this.boardRepository.findById(addTodoDTO.getBoardId()).map(findBoard -> {
            Todo todo = new Todo();
            todo.setAddTodoDTO(addTodoDTO);
            todo.setBoard(findBoard);
            todoRepository.save(todo);
            return todo;
        }).orElseThrow(() -> new Exception("Board not found"));
    }

    public void updateTodo(Long id, UpdateTodoDTO updateTodoDTO) {
        this.todoRepository.findById(id).ifPresent(findTodo -> {
            findTodo.setUpdateTodoDTO(updateTodoDTO);
            this.todoRepository.save(findTodo);
        });
    }

    public void deleteTodo(Long id) {
        this.todoRepository.findById(id).ifPresent(findTodo -> {
            findTodo.getCards().forEach(this.cardRepository::delete);
            this.todoRepository.delete(findTodo);
        });
    }

    public void moveTodo(Long boardId, Integer prev, Integer current) {
        this.boardRepository.findById(boardId).ifPresent(board -> {
            final int[] i = {0};
            if (prev < current) {
                // drag down
                board.getTodos().stream().filter(todo ->
                        todo.getOrdinal() >= prev && todo.getOrdinal() <= current
                ).sorted(Comparator.comparing(Todo::getOrdinal)).forEach((todo) -> {
                    if (i[0] == 0) {
                        todo.setOrdinal(current);
                    } else {
                        todo.setOrdinal(todo.getOrdinal() - 1);
                    }
                    this.todoRepository.save(todo);
                    i[0]++;
                });
            } else {
                // drag up
                board.getTodos().stream().filter(todo ->
                        todo.getOrdinal() >= current && todo.getOrdinal() <= prev
                ).sorted(Comparator.comparing(Todo::getOrdinal)).forEach((todo) -> {
                    if (i[0] == board.getTodos().size() - 1) {
                        todo.setOrdinal(current);
                    } else {
                        todo.setOrdinal(todo.getOrdinal() + 1);
                    }
                    this.todoRepository.save(todo);
                    i[0]++;
                });
            }
        });
    }
}
