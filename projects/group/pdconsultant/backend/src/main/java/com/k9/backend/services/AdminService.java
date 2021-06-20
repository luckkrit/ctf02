package com.k9.backend.services;

import com.k9.backend.dtos.ListAdminDTO;
import com.k9.backend.repository.AdminRepository;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminService {
    private final AdminRepository adminRepository;

    public List<ListAdminDTO> getAllAdmin() {
        return adminRepository.findAll().stream().map(admin -> new ListAdminDTO(admin.getId(), admin.getFullName()))
                .collect(Collectors.toList());
    }
}
