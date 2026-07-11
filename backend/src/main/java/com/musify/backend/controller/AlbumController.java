package com.musify.backend.controller;

import com.musify.backend.dto.response.AlbumResponse;
import com.musify.backend.service.AlbumService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/albums")
public class AlbumController {

    private final AlbumService albumService;

    public AlbumController(AlbumService albumService) {
        this.albumService = albumService;
    }

    @GetMapping
    public List<AlbumResponse> getAllAlbums() {
        return albumService.getAllAlbums();
    }

    @GetMapping("/{id}")
    public AlbumResponse getAlbumById(@PathVariable Long id) {
        return albumService.getAlbumById(id);
    }
}