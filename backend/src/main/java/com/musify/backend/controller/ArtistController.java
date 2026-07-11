package com.musify.backend.controller;

import com.musify.backend.dto.response.ArtistResponse;
import com.musify.backend.service.ArtistService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/artists")
public class ArtistController {

    private final ArtistService artistService;

    public ArtistController(ArtistService artistService) {
        this.artistService = artistService;
    }

    @GetMapping
    public List<ArtistResponse> getAllArtists() {
        return artistService.getAllArtists();
    }

    @GetMapping("/{id}")
    public ArtistResponse getArtistById(@PathVariable Long id) {
        return artistService.getArtistById(id);
    }
}