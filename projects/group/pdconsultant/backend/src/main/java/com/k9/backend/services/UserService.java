package com.k9.backend.services;

import com.k9.backend.models.User;
import com.k9.backend.repository.UserRepository;

import org.springframework.stereotype.Service;

import java.util.List;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    public User findUser(User user) {
        return this.userRepository.findAll().stream().filter((User u) -> user.getUsername().equals(u.getUsername()) && user.getPassword().equals(u.getPassword())).findAny().orElse(null);
    }

    public User findUserByUsername(String username) {
        return this.userRepository.findByUsername(username).orElse(null);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}
