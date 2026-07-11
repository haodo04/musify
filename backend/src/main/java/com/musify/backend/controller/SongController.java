package com.musify.backend.controller;

import com.musify.backend.dto.response.SongResponse;
import com.musify.backend.service.SongService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/songs")
public class SongController {

    private final SongService songService;

    public SongController(SongService songService) {
        this.songService = songService;
    }

    @GetMapping
    public List<SongResponse> getAllSongs() {
        return songService.getAllSongs();
    }

    @GetMapping("/{id}")
    public SongResponse getSongById(@PathVariable Long id) {
        return songService.getSongById(id);
    }

    @GetMapping("/album/{albumId}")
    public List<SongResponse> getSongsByAlbum(@PathVariable Long albumId) {
        return songService.getSongsByAlbumId(albumId);
    }

    @GetMapping("/search")
    public List<SongResponse> search(@RequestParam String keyword) {
        return songService.searchSongs(keyword);
    }
}