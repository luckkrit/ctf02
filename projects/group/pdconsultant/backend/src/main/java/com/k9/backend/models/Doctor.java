package com.k9.backend.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.k9.backend.dtos.RegisterDTO;

import java.util.Set;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.Index;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
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
@Table(name = "doctor", indexes = @Index(columnList = "fullName, user_id, specialty_id"))
@NoArgsConstructor
@AllArgsConstructor
@Data
public class Doctor {
    @Id
    private Long id;
    @NotBlank
    private String fullName;

    @OneToOne
    @MapsId
    @JsonBackReference
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private User user;

    @ManyToOne
    @JoinColumn(name = "specialty_id", nullable = false)
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private Specialty specialty;

    @OneToMany(mappedBy = "doctor", fetch = FetchType.EAGER)
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private Set<Appointment> appointments;

    @OneToMany(mappedBy = "doctor", fetch = FetchType.LAZY)
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private Set<DoctorChatMessage> doctorChatMessages;

    public void setRegisterDTO(RegisterDTO registerDTO) {
        this.setFullName(registerDTO.getFullName());
        this.setSpecialty(registerDTO.getSpecialty());
    }
}
