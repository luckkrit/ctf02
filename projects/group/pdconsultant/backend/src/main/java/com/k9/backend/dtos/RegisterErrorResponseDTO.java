package com.k9.backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RegisterErrorResponseDTO {
    private String key;
    private String value;
}
