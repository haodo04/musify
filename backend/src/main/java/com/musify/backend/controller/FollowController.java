package com.musify.backend.controller;

import com.musify.backend.dto.response.ArtistResponse;
import com.musify.backend.security.CustomUserDetails;
import com.musify.backend.service.FollowService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/follows")
@RequiredArgsConstructor
public class FollowController {

    private final FollowService followService;

    @PostMapping("/{artistId}")
    public void follow(@AuthenticationPrincipal CustomUserDetails userDetails, @PathVariable Long artistId) {
        followService.follow(userDetails.getUsername(), artistId);
    }

    @DeleteMapping("/{artistId}")
    public void unfollow(@AuthenticationPrincipal CustomUserDetails userDetails, @PathVariable Long artistId) {
        followService.unfollow(userDetails.getUsername(), artistId);
    }

    @GetMapping
    public List<ArtistResponse> getMyFollowedArtists(@AuthenticationPrincipal CustomUserDetails userDetails) {
        return followService.getFollowedArtists(userDetails.getUsername());
    }

    @GetMapping("/{artistId}/status")
    public Map<String, Boolean> checkFollowing(@AuthenticationPrincipal CustomUserDetails userDetails, @PathVariable Long artistId) {
        return Map.of("isFollowing", followService.isFollowing(userDetails.getUsername(), artistId));
    }

    @GetMapping("/{artistId}/count")
    public Map<String, Long> getFollowerCount(@PathVariable Long artistId) {
        return Map.of("count", followService.getFollowerCount(artistId));
    }
}