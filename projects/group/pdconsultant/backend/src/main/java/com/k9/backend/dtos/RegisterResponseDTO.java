package com.k9.backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RegisterResponseDTO {
    private boolean valid;
    private RegisterErrorResponseDTO message;
}
