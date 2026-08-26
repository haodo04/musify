package com.musify.backend.controller;

import com.musify.backend.dto.request.ArtistRequest;
import com.musify.backend.dto.response.ArtistResponse;
import com.musify.backend.service.ArtistService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/artists")
@RequiredArgsConstructor
public class ArtistController {

    private final ArtistService artistService;

    @PostMapping(consumes = "multipart/form-data")
    public ArtistResponse createArtist(
            @RequestParam String name,
            @RequestParam(required = false) String bio,
            @RequestParam(required = false) MultipartFile avatarFile,
            @RequestParam(required = false) MultipartFile bannerFile) throws IOException {

        ArtistRequest request = new ArtistRequest();
        request.setName(name);
        request.setBio(bio);
        request.setAvatarFile(avatarFile);
        request.setBannerFile(bannerFile);

        return artistService.createArtist(request);
    }

    @GetMapping
    public List<ArtistResponse> getAllArtists() {
        return artistService.getAllArtists();
    }

    @GetMapping("/{id}")
    public ArtistResponse getArtistById(@PathVariable Long id) {
        return artistService.getArtistById(id);
    }

    @DeleteMapping("/{id}")
    public void deleteArtist(@PathVariable Long id) {
        artistService.deleteArtist(id);
    }

    @PutMapping(value = "/{id}", consumes = "multipart/form-data")
    public ArtistResponse updateArtist(
            @PathVariable Long id,
            @RequestParam String name,
            @RequestParam(required = false) String bio,
            @RequestParam(required = false) MultipartFile avatarFile,
            @RequestParam(required = false) MultipartFile bannerFile) throws IOException {

        ArtistRequest request = new ArtistRequest();
        request.setName(name);
        request.setBio(bio);
        request.setAvatarFile(avatarFile);
        request.setBannerFile(bannerFile);

        return artistService.updateArtist(id, request);
    }
}