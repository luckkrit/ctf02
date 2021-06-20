package com.k9.backend.services;

import com.k9.backend.dtos.AddBoardDTO;
import com.k9.backend.dtos.UpdateBoardDTO;
import com.k9.backend.models.Board;
import com.k9.backend.repository.BoardRepository;
import com.k9.backend.repository.CardRepository;
import com.k9.backend.repository.TodoRepository;
import com.k9.backend.repository.UserRepository;

import org.springframework.stereotype.Service;

import java.util.List;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BoardService {
    private final BoardRepository boardRepository;
    private final TodoRepository todoRepository;
    private final CardRepository cardRepository;
    private final UserRepository userRepository;

    public List<Board> getAllBoardsByUserId(Long userId) {
        return boardRepository.findAllByUserId(userId);
    }

    public Board addBoard(AddBoardDTO addBoardDTO) throws Exception {
        return this.userRepository.findById(addBoardDTO.getUserId()).map(findUser -> {

            Board board = new Board();
            board.setAddBoardDTO(addBoardDTO);
            board.setUser(findUser);
            this.boardRepository.save(board);
            return board;
        }).orElseThrow(() -> new Exception("User not found"));
    }

    public void updateBoard(Long id, UpdateBoardDTO updateBoardDTO) {
        this.boardRepository.findById(id).ifPresent(findBoard -> {
            findBoard.setUpdateBoardDTO(updateBoardDTO);
            this.boardRepository.save(findBoard);
        });
    }

    public void deleteBoard(Long id) {
        this.boardRepository.findById(id).ifPresent(board -> {
            board.getTodos().forEach((todo) -> {
                todo.getCards().forEach(this.cardRepository::delete);
                this.todoRepository.delete(todo);
            });
            this.boardRepository.delete(board);
        });
    }

    public Board getBoard(Long id) throws Exception {
        return this.boardRepository.findById(id).orElseThrow(() -> new Exception("Board not found"));
    }
}
