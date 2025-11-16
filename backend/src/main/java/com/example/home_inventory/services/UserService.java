package com.example.home_inventory.services;

import com.example.home_inventory.models.LoginDto;
import com.example.home_inventory.models.LoginResponse;
import com.example.home_inventory.models.User;
import com.example.home_inventory.models.UserDto;
import com.example.home_inventory.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@AllArgsConstructor
public class UserService {


    @Autowired
    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    private final AuthenticationManager authenticationManager;

    private final TokenService tokenService;

    //registrar usuario
    public User registerUser(UserDto userDto){
        User user = new User();
        user.setUsername(userDto.username());
        user.setEmail(userDto.email());
        user.setPassword(passwordEncoder.encode(userDto.password()));
        user.setRole(List.of("ROLE_USER"));

        return userRepository.save(user);
    }

    public LoginResponse authenticate(LoginDto input){
        var authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(input.username(), input.password()));
        var user = (User) authentication.getPrincipal();
        String token = tokenService.generateToken(authentication);
        return new LoginResponse(token, user.getUsername(), user.getEmail());
    }

    public Map<String, String> userInfo(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        return Map.of(
                "username", user.getUsername(),
                "email", user.getEmail()
        );
    }

    //buscar usuario por username
    public Optional<User> singleUser(String username){
        return userRepository.findByUsername(username);
    }

}
