package com.k9.backend.controllers;

import com.k9.backend.services.UserService;

import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

//    @PostMapping("/login")
//    public Boolean login(@RequestBody User user) {
//        User foundUser = userService.findUser(user);
//        return foundUser != null;
//    }
}
