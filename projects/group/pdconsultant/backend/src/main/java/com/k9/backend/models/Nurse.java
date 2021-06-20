package com.k9.backend.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.k9.backend.dtos.RegisterDTO;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Index;
import javax.persistence.JoinColumn;
import javax.persistence.MapsId;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import javax.validation.constraints.NotBlank;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@Table(name = "nurse", indexes = @Index(columnList = "fullName, user_id"))
@NoArgsConstructor
@AllArgsConstructor
@Data
public class Nurse {
    @Id
    @Column(name = "nurse_id")
    private Long id;
    @NotBlank
    private String fullName;

    @OneToOne
    @MapsId
    @JoinColumn(name = "user_id")
    @JsonBackReference
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private User user;

    public void setRegisterDTO(RegisterDTO registerDTO) {
        this.setFullName(registerDTO.getFullName());
    }
}
