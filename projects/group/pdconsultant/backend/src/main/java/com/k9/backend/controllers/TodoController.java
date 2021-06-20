package com.k9.backend.controllers;

import com.k9.backend.dtos.AddTodoDTO;
import com.k9.backend.dtos.UpdateTodoDTO;
import com.k9.backend.models.Todo;
import com.k9.backend.services.TodoService;

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
@RequestMapping("/todos")
public class TodoController {
    private final TodoService todoService;

    @PostMapping("")
    public ResponseEntity<Todo> addTodo(@RequestBody AddTodoDTO addTodoDTO) {
        try {
            Todo todo = this.todoService.addTodo(addTodoDTO);
            return new ResponseEntity<>(todo, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateTodo(@PathVariable Long id, @RequestBody UpdateTodoDTO updateTodoDTO) {
        this.todoService.updateTodo(id, updateTodoDTO);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PutMapping("/move/{boardId}/{prev}/{current}")
    public ResponseEntity<?> moveTodo(@PathVariable Long boardId, @PathVariable Integer prev, @PathVariable Integer current) {
        this.todoService.moveTodo(boardId, prev, current);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTodo(@PathVariable Long id) {
        this.todoService.deleteTodo(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
