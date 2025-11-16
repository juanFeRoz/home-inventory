package com.example.home_inventory.controllers;

import com.example.home_inventory.models.LoginDto;
import com.example.home_inventory.models.LoginResponse;
import com.example.home_inventory.models.User;
import com.example.home_inventory.models.UserDto;
import com.example.home_inventory.services.UserService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/user")
@AllArgsConstructor
public class UserController {


    private final UserService userService;

    @PostMapping("/signup")
    public ResponseEntity<User> register(
            @RequestParam String username,
            @RequestParam String email,
            @RequestParam String password) throws IOException {
        UserDto registerUserDto = new UserDto(username, email, password);
        User registeredUser = userService.registerUser(registerUserDto);
        return ResponseEntity.ok(registeredUser);
    }

    @PostMapping("/signin")
    public ResponseEntity<LoginResponse> authenticate(@RequestBody LoginDto loginUserDto) {
        var loginResponse = userService.authenticate(loginUserDto);
        return ResponseEntity.ok(loginResponse);
    }

    @GetMapping("/info/{userId}")
    public ResponseEntity<?> obtenerInfoUsuario(@PathVariable String userId) {
        try {
            Map<String, String> userInfo = userService.userInfo(userId);
            return ResponseEntity.ok(userInfo);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
}
