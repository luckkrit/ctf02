package com.k9.backend.dtos;

import lombok.Data;

@Data
public class AddBoardDTO {
    private String title;
    private Long userId;
}
