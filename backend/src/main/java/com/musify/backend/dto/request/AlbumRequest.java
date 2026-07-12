package com.musify.backend.dto.request;

import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;
import java.time.LocalDate;

@Getter @Setter
public class AlbumRequest {
    private String title;
    private LocalDate releaseDate;
    private Long artistId;
    private MultipartFile coverFile;
}