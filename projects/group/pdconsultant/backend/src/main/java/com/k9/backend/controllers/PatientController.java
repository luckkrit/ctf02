package com.k9.backend.controllers;

import com.k9.backend.dtos.ListPatientDTO;
import com.k9.backend.services.PatientService;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/patient")
public class PatientController {
    private final PatientService patientService;

    @GetMapping("")
    public List<ListPatientDTO> getAllPatients() {
        return patientService.getAllPatients();
    }
}
