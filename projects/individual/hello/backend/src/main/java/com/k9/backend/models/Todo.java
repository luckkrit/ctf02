package com.k9.backend.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.k9.backend.dtos.AddTodoDTO;
import com.k9.backend.dtos.UpdateTodoDTO;

import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "todo")
@NoArgsConstructor
@AllArgsConstructor
@Data
public class Todo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotBlank
    private String title;
    @NotNull
    private Integer ordinal;

    @ManyToOne
    @JoinColumn(name = "board_id")
    @JsonBackReference
    private Board board;

    @OneToMany(mappedBy = "todo", cascade = CascadeType.ALL)
    private List<Card> cards;

    public void setAddTodoDTO(AddTodoDTO addTodoDTO) {
        this.setTitle(addTodoDTO.getTitle());
        this.setOrdinal(addTodoDTO.getOrdinal());
    }

    public void setUpdateTodoDTO(UpdateTodoDTO updateTodoDTO) {
        this.setTitle(updateTodoDTO.getTitle());
    }
}
