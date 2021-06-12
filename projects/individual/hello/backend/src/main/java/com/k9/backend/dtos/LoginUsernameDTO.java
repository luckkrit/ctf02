package com.k9.backend.dtos;

import javax.validation.constraints.NotBlank;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginUsernameDTO {
    @NotBlank
    private String username;

    @NotBlank
    private String password;

}
