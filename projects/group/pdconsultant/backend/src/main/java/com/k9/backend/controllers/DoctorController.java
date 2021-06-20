package com.k9.backend.controllers;

import com.k9.backend.dtos.ListDoctorDTO;
import com.k9.backend.services.DoctorService;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/doctor")
public class DoctorController {
    private final DoctorService doctorService;

    @GetMapping("")
    public List<ListDoctorDTO> getAllDoctors() {
        return doctorService.getAllDoctors();
    }
}
