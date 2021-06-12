package com.k9.backend.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.k9.backend.dtos.AddCardDTO;
import com.k9.backend.dtos.UpdateCardDTO;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "card")
@NoArgsConstructor
@AllArgsConstructor
@Data
public class Card {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotBlank
    private String title;
    @NotNull
    private Integer ordinal;

    @ManyToOne
    @JoinColumn(name = "todo_id")
    @JsonBackReference
    private Todo todo;

    public void setAddCardDTO(AddCardDTO addCardDTO) {
        this.setOrdinal(addCardDTO.getOrdinal());
        this.setTitle(addCardDTO.getTitle());
    }

    public void setUpdateCardDTO(UpdateCardDTO updateCardDTO) {
        this.setTitle(updateCardDTO.getTitle());
    }
}
