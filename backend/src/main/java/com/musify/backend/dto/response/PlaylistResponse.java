package com.musify.backend.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import java.util.List;

@Getter @AllArgsConstructor
public class PlaylistResponse {
    private Long id;
    private String name;
    private String description;
    private String coverUrl;

    @JsonProperty("isPublic")
    private boolean isPublic;
    private List<SongResponse> songs;
}