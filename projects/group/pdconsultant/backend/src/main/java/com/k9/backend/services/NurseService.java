package com.k9.backend.services;

import com.k9.backend.dtos.ListNurseDTO;
import com.k9.backend.repository.NurseRepository;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NurseService {
    private final NurseRepository nurseRepository;

    public List<ListNurseDTO> getAllNurses() {
        return nurseRepository.findAll().stream().map(nurse -> new ListNurseDTO(nurse.getId(), nurse.getFullName())).collect(Collectors.toList());
    }
}
