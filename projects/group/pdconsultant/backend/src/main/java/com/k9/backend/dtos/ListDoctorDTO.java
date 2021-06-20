package com.k9.backend.dtos;

import com.k9.backend.models.Specialty;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ListDoctorDTO {
    private Long id;
    private String fullName;
    private Specialty specialty;
}
