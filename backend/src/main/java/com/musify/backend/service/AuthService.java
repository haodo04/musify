package com.musify.backend.service;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.musify.backend.dto.request.GoogleAuthRequest;
import com.musify.backend.dto.request.LoginRequest;
import com.musify.backend.dto.request.RegisterRequest;
import com.musify.backend.dto.response.AuthResponse;
import com.musify.backend.entity.AuthProvider;
import com.musify.backend.entity.User;
import com.musify.backend.repository.UserRepository;
import com.musify.backend.security.GoogleTokenVerifier;
import com.musify.backend.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final GoogleTokenVerifier googleTokenVerifier;


    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email đã được sử dụng");
        }
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Tên người dùng đã được sử dụng");
        }

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .provider(AuthProvider.LOCAL)
                .build();

        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getEmail());
        return new AuthResponse(token, user.getId(), user.getUsername(), user.getEmail(), user.getRole().name());
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Email hoặc mật khẩu không đúng"));

        if (user.getProvider() == AuthProvider.GOOGLE) {
            throw new RuntimeException("Tài khoản này đăng nhập bằng Google, vui lòng dùng nút Đăng nhập bằng Google");
        }

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
        } catch (Exception e) {
            throw new RuntimeException("Email hoặc mật khẩu không đúng");
        }

        String token = jwtUtil.generateToken(user.getEmail());
        return new AuthResponse(token, user.getId(), user.getUsername(), user.getEmail(), user.getRole().name());
    }

    public AuthResponse loginWithGoogle(GoogleAuthRequest request) {
        GoogleIdToken.Payload payload = googleTokenVerifier.verify(request.getIdToken());

        String email = payload.getEmail();
        String name = (String) payload.get("name");
        String picture = (String) payload.get("picture");

        User user = userRepository.findByEmail(email).orElse(null);

        if (user == null) {
            String baseUsername = (name != null && !name.isBlank()) ? name.replaceAll("\\s+", "") : email.split("@")[0];
            String username = generateUniqueUsername(baseUsername);

            user = User.builder()
                    .username(username)
                    .email(email)
                    .password(null)
                    .avatarUrl(picture)
                    .provider(AuthProvider.GOOGLE)
                    .build();
            userRepository.save(user);
        }

        String token = jwtUtil.generateToken(user.getEmail());
        return new AuthResponse(token, user.getId(), user.getUsername(), user.getEmail(), user.getRole().name());
    }

    private String generateUniqueUsername(String base) {
        String result = base;
        int suffix = 1;
        while (userRepository.existsByUsername(result)) {
            result = base + suffix;
            suffix++;
        }
        return result;
    }
}