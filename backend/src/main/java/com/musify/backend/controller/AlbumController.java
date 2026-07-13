package com.musify.backend.controller;

import com.musify.backend.dto.request.AlbumRequest;
import com.musify.backend.dto.response.AlbumResponse;
import com.musify.backend.service.AlbumService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/albums")
@RequiredArgsConstructor
public class AlbumController {

    private final AlbumService albumService;

    @PostMapping(consumes = "multipart/form-data")
    public AlbumResponse createAlbum(
            @RequestParam String title,
            @RequestParam(required = false) String releaseDate,
            @RequestParam Long artistId,
            @RequestParam(required = false) MultipartFile coverFile) throws IOException {

        AlbumRequest request = new AlbumRequest();
        request.setTitle(title);
        request.setReleaseDate(releaseDate != null ? LocalDate.parse(releaseDate) : null);
        request.setArtistId(artistId);
        request.setCoverFile(coverFile);

        return albumService.createAlbum(request);
    }

    @GetMapping
    public List<AlbumResponse> getAllAlbums() {
        return albumService.getAllAlbums();
    }

    @GetMapping("/{id}")
    public AlbumResponse getAlbumById(@PathVariable Long id) {
        return albumService.getAlbumById(id);
    }

    @GetMapping("/charts")
    public List<AlbumResponse> getCharts() {
        return albumService.getFeaturedCharts();
    }
}