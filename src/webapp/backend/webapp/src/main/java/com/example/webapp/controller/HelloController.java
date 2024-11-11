package com.example.webapp.controller;

import com.example.webapp.dto.Hello;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;

@RestController
@RequestMapping("/api")
public class HelloController {

    @GetMapping("/hello")
    public Hello getHello() {
        // Create a Hello object with a sample message and the current date
        return new Hello("Hello, world!", LocalDate.now());
    }
}