package com.musify.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter @AllArgsConstructor
public class ArtistResponse {
    private Long id;
    private String name;
    private String avatarUrl;
}