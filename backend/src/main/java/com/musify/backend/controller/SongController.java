package com.musify.backend.controller;

import com.musify.backend.dto.request.SongUploadRequest;
import com.musify.backend.dto.response.SongResponse;
import com.musify.backend.service.SongService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/songs")
@RequiredArgsConstructor
public class SongController {

    private final SongService songService;

    @PostMapping(value = "/upload", consumes = "multipart/form-data")
    public SongResponse uploadSong(
            @RequestParam String title,
            @RequestParam String genre,
            @RequestParam Integer duration,
            @RequestParam Long artistId,
            @RequestParam(required = false) Long albumId,
            @RequestParam MultipartFile audioFile,
            @RequestParam(required = false) MultipartFile imageFile) throws IOException {

        SongUploadRequest request = new SongUploadRequest();
        request.setTitle(title);
        request.setGenre(genre);
        request.setDuration(duration);
        request.setArtistId(artistId);
        request.setAlbumId(albumId);
        request.setAudioFile(audioFile);
        request.setImageFile(imageFile);

        return songService.uploadSong(request);
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

    @PostMapping("/{id}/play")
    public void recordPlay(@PathVariable Long id) {
        songService.incrementPlayCount(id);
    }

    @GetMapping("/trending")
    public List<SongResponse> getTrending() {
        return songService.getTrendingSongs();
    }

    @GetMapping("/artist/{artistId}")
    public List<SongResponse> getSongsByArtist(@PathVariable Long artistId) {
        return songService.getSongsByArtistId(artistId);
    }

    @DeleteMapping("/{id}")
    public void deleteSong(@PathVariable Long id) {
        songService.deleteSong(id);
    }

    @PutMapping(value = "/{id}", consumes = "multipart/form-data")
    public SongResponse updateSong(
            @PathVariable Long id,
            @RequestParam String title,
            @RequestParam String genre,
            @RequestParam Integer duration,
            @RequestParam Long artistId,
            @RequestParam(required = false) Long albumId,
            @RequestParam(required = false) MultipartFile audioFile,
            @RequestParam(required = false) MultipartFile imageFile) throws IOException {

        SongUploadRequest request = new SongUploadRequest();
        request.setTitle(title);
        request.setGenre(genre);
        request.setDuration(duration);
        request.setArtistId(artistId);
        request.setAlbumId(albumId);
        request.setAudioFile(audioFile);
        request.setImageFile(imageFile);

        return songService.updateSong(id, request);
    }

    @GetMapping("/search/semantic")
    public List<SongResponse> searchSemantic(
            @RequestParam String q,
            @RequestParam(defaultValue = "10") int topK) {
        return songService.searchSemantic(q, topK);
    }

    @PostMapping("/embeddings/generate")
    public String generateEmbeddings() {
        int count = songService.backfillEmbeddings();
        return "Da sinh embedding cho " + count + " bai hat";
    }
}