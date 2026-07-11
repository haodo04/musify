package com.musify.backend.controller;

import com.musify.backend.dto.request.PlaylistRequest;
import com.musify.backend.dto.response.PlaylistResponse;
import com.musify.backend.security.CustomUserDetails;
import com.musify.backend.service.PlaylistService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/playlists")
public class PlaylistController {

    private final PlaylistService playlistService;

    public PlaylistController(PlaylistService playlistService) {
        this.playlistService = playlistService;
    }

    @PostMapping
    public PlaylistResponse createPlaylist(@AuthenticationPrincipal CustomUserDetails userDetails,
                                           @RequestBody PlaylistRequest request) {
        return playlistService.createPlaylist(userDetails.getUsername(), request);
    }

    @GetMapping("/me")
    public List<PlaylistResponse> getMyPlaylists(@AuthenticationPrincipal CustomUserDetails userDetails) {
        return playlistService.getMyPlaylists(userDetails.getUsername());
    }

    @GetMapping("/{id}")
    public PlaylistResponse getPlaylistById(@PathVariable Long id) {
        return playlistService.getPlaylistById(id);
    }

    @PostMapping("/{playlistId}/songs/{songId}")
    public void addSong(@PathVariable Long playlistId, @PathVariable Long songId) {
        playlistService.addSongToPlaylist(playlistId, songId);
    }

    @DeleteMapping("/{playlistId}/songs/{songId}")
    public void removeSong(@PathVariable Long playlistId, @PathVariable Long songId) {
        playlistService.removeSongFromPlaylist(playlistId, songId);
    }

    @DeleteMapping("/{id}")
    public void deletePlaylist(@PathVariable Long id) {
        playlistService.deletePlaylist(id);
    }
}