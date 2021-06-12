package com.k9.backend.dtos;

import lombok.Data;

@Data
public class AddTodoDTO {
    private String title;
    private Long boardId;
    private Integer ordinal;
}
