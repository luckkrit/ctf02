package com.k9.backend.controllers;

import com.k9.backend.dtos.ListNurseDTO;
import com.k9.backend.services.NurseService;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/nurse")
public class NurseController {
    private final NurseService nurseService;

    @GetMapping("")
    public List<ListNurseDTO> getAllNurses() {
        return this.nurseService.getAllNurses();
    }
}
