package com.k9.backend.dtos;

import lombok.Data;

@Data
public class AddCardDTO {
    private String title;
    private Integer ordinal;
    private Long todoId;
}
