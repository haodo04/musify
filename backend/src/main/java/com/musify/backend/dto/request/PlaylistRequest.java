package com.musify.backend.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class PlaylistRequest {
    private String name;
    private String description;

    @JsonProperty("isPublic")
    private boolean isPublic;
}