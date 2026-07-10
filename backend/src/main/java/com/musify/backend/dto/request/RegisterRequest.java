package com.musify.backend.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class RegisterRequest {
    private String username;
    private String email;
    private String password;
}