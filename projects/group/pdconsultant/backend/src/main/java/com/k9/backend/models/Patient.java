package com.k9.backend.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.k9.backend.dtos.RegisterDTO;

import java.util.Set;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.Index;
import javax.persistence.JoinColumn;
import javax.persistence.MapsId;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import javax.validation.constraints.NotBlank;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@Table(name = "patient", indexes = @Index(columnList = "user_id, fullName,"))
@NoArgsConstructor
@AllArgsConstructor
@Data
public class Patient {
    @Id
    @Column(name = "patient_id")
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

    @OneToMany(mappedBy = "patient", fetch = FetchType.EAGER)
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    @JsonBackReference
    private Set<Appointment> appointments;

    @OneToMany(mappedBy = "patient", fetch = FetchType.LAZY)
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    @JsonBackReference
    private Set<PatientChatMessage> patientChatMessages;

    public void setRegisterDTO(RegisterDTO registerDTO) {
        this.setFullName(registerDTO.getFullName());
    }
}
