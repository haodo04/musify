package com.musify.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import java.time.LocalDate;

@Getter @AllArgsConstructor
public class AlbumResponse {
    private Long id;
    private String title;
    private String coverUrl;
    private LocalDate releaseDate;
    private ArtistResponse artist;
}