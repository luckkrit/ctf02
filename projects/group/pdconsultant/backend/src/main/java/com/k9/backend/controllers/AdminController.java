package com.k9.backend.controllers;

import com.k9.backend.dtos.ListAdminDTO;
import com.k9.backend.services.AdminService;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/admin")
public class AdminController {
    private final AdminService adminService;

    @GetMapping("")
    public List<ListAdminDTO> getAllAdmin() {
        return adminService.getAllAdmin();
    }
}
