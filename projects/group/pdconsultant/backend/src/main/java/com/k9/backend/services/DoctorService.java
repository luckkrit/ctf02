package com.k9.backend.services;

import com.k9.backend.dtos.ListDoctorDTO;
import com.k9.backend.repository.DoctorRepository;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DoctorService {
    private final DoctorRepository doctorRepository;

    public List<ListDoctorDTO> getAllDoctors() {
        return this.doctorRepository.findAll().stream().map(doctor -> new ListDoctorDTO(doctor.getId(), doctor.getFullName(), doctor.getSpecialty())).collect(Collectors.toList());
    }
}
