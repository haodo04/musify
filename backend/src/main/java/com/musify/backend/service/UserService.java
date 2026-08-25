package com.musify.backend.service;

import com.musify.backend.entity.User;
import com.musify.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final CloudinaryService cloudinaryService;

    public User updateProfile(String email, String username, MultipartFile avatarFile) throws IOException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        if (username != null && !username.trim().isEmpty()) {
            user.setUsername(username.trim());
        }

        if (avatarFile != null && !avatarFile.isEmpty()) {
            String avatarUrl = cloudinaryService.uploadImage(avatarFile);
            user.setAvatarUrl(avatarUrl);
        }

        return userRepository.save(user);
    }
}