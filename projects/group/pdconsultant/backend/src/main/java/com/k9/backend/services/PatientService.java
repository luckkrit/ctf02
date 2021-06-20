package com.k9.backend.services;

import com.k9.backend.dtos.ListPatientDTO;
import com.k9.backend.repository.PatientRepository;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PatientService {
    private final PatientRepository patientRepository;

    public List<ListPatientDTO> getAllPatients() {
        return patientRepository.findAll().stream().map(patient -> new ListPatientDTO(patient.getId(), patient.getFullName())).collect(Collectors.toList());
    }
}
