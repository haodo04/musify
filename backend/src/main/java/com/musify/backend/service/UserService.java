package com.musify.backend.service;

import com.musify.backend.dto.response.UserResponse;
import com.musify.backend.entity.Role;
import com.musify.backend.entity.User;
import com.musify.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

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

    private UserResponse toResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getAvatarUrl(),
                user.getRole().name(),
                user.getCreatedAt()
        );
    }

    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public UserResponse updateUserRole(Long userId, Role newRole, String currentAdminEmail) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Khong tim thay user"));

        if (user.getEmail().equalsIgnoreCase(currentAdminEmail) && newRole != Role.ADMIN) {
            throw new RuntimeException("Không thể tự hạ quyền của chính mình");
        }

        user.setRole(newRole);
        userRepository.save(user);
        return toResponse(user);
    }
}