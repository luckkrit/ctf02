package com.k9.backend.controllers;

import com.k9.backend.dtos.LoginEmailDTO;
import com.k9.backend.dtos.LoginResponseDTO;
import com.k9.backend.dtos.LoginUsernameDTO;
import com.k9.backend.dtos.RegisterDTO;
import com.k9.backend.dtos.RegisterResponseDTO;
import com.k9.backend.services.AuthService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@RequestBody LoginUsernameDTO loginDTO) {
        return ResponseEntity.ok(this.authService.loginWithUsername(loginDTO));
    }

    @PostMapping("/login/email")
    public ResponseEntity<LoginResponseDTO> login(@RequestBody LoginEmailDTO loginDTO) {
        return ResponseEntity.ok(this.authService.loginWithEmail(loginDTO));
    }

    @PostMapping("/register")
    public ResponseEntity<RegisterResponseDTO> register(@RequestBody RegisterDTO registerDTO) {
        return ResponseEntity.ok(this.authService.register(registerDTO));
    }
}
