package com.musify.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter @AllArgsConstructor
public class SongResponse {
    private Long id;
    private String title;
    private String audioUrl;
    private String imageUrl;
    private Integer duration;
    private String genre;
    private ArtistResponse artist;
    private Long albumId;
}