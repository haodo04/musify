package com.musify.backend.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GoogleAuthRequest {
    private String idToken;
}