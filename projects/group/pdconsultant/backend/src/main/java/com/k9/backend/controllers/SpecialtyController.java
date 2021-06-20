package com.k9.backend.controllers;

import com.k9.backend.models.Specialty;
import com.k9.backend.services.SpecialtyService;

import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class SpecialtyController {
    private final SpecialtyService specialtyService;

    public List<Specialty> getAllSpecialties() {
        return specialtyService.getAllSpecialties();
    }
}
