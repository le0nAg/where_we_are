package com.example.webapp.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class Hello {
    private String message;
    private LocalDate date;

    public Hello(String message, LocalDate date) {
        this.message = message;
        this.date = date;
    }
}
