package com.musify.backend.dto.request;

import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

@Getter @Setter
public class SongUploadRequest {
    private String title;
    private String genre;
    private Integer duration;
    private Long artistId;
    private Long albumId;
    private MultipartFile audioFile;
    private MultipartFile imageFile;
}