package com.musify.backend.dto.request;

import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

@Getter @Setter
public class ArtistRequest {
    private String name;
    private String bio;
    private MultipartFile avatarFile;
    private MultipartFile bannerFile;
}