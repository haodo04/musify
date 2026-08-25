package com.musify.backend.controller;

import com.musify.backend.dto.response.SongResponse;
import com.musify.backend.security.CustomUserDetails;
import com.musify.backend.service.FavoriteService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/favorites")
@RequiredArgsConstructor
public class FavoriteController {

    private final FavoriteService favoriteService;

    @PostMapping("/{songId}")
    public void addFavorite(@AuthenticationPrincipal CustomUserDetails userDetails,
                            @PathVariable Long songId) {
        favoriteService.addFavorite(userDetails.getUsername(), songId);
    }

    @DeleteMapping("/{songId}")
    public void removeFavorite(@AuthenticationPrincipal CustomUserDetails userDetails,
                               @PathVariable Long songId) {
        favoriteService.removeFavorite(userDetails.getUsername(), songId);
    }

    @GetMapping
    public List<SongResponse> getMyFavorites(@AuthenticationPrincipal CustomUserDetails userDetails) {
        return favoriteService.getMyFavorites(userDetails.getUsername());
    }

    @GetMapping("/{songId}/status")
    public Map<String, Boolean> checkFavorite(@AuthenticationPrincipal CustomUserDetails userDetails,
                                              @PathVariable Long songId) {
        return Map.of("isFavorite", favoriteService.isFavorite(userDetails.getUsername(), songId));
    }
}