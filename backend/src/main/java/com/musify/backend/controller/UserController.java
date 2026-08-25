package com.musify.backend.controller;

import com.musify.backend.entity.User;
import com.musify.backend.security.CustomUserDetails;
import com.musify.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PutMapping("/me")
    public ResponseEntity<User> updateProfile(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestParam(required = false) String username,
            @RequestParam(required = false) MultipartFile avatarFile) throws IOException {

        User updatedUser = userService.updateProfile(userDetails.getUsername(), username, avatarFile);

        return ResponseEntity.ok(updatedUser);
    }
}