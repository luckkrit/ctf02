package com.k9.backend.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.k9.backend.dtos.AddBoardDTO;
import com.k9.backend.dtos.UpdateBoardDTO;

import org.springframework.data.annotation.Id;

import java.util.List;


import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import javax.validation.constraints.NotBlank;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "board")
@NoArgsConstructor
@AllArgsConstructor
@Data
public class Board {
    @javax.persistence.Id
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long id;
    @NotBlank
    private String title;

    @OneToMany(mappedBy = "board", cascade = CascadeType.ALL)
    private List<Todo> todos;

    @OneToOne
    @JoinColumn(name = "user_id")
    @JsonBackReference
    private User user;

    public void setAddBoardDTO(AddBoardDTO addBoardDTO) {
        this.setTitle(addBoardDTO.getTitle());
    }

    public void setUpdateBoardDTO(UpdateBoardDTO updateBoardDTO) {
        this.setTitle(updateBoardDTO.getTitle());
    }

}
