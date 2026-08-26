package com.musify.backend.service;

import com.musify.backend.dto.response.ArtistResponse;
import com.musify.backend.entity.Artist;
import com.musify.backend.entity.Follow;
import com.musify.backend.entity.User;
import com.musify.backend.repository.ArtistRepository;
import com.musify.backend.repository.FollowRepository;
import com.musify.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FollowService {

    private final FollowRepository followRepository;
    private final ArtistRepository artistRepository;
    private final UserRepository userRepository;
    private final ArtistService artistService;

    @Transactional
    public void follow(String email, Long artistId) {
        User user = getUserByEmail(email);
        Artist artist = artistRepository.findById(artistId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy nghệ sĩ"));

        if (followRepository.findByUserIdAndArtistId(user.getId(), artistId).isPresent()) {
            return;
        }

        Follow follow = Follow.builder()
                .user(user)
                .artist(artist)
                .build();
        followRepository.save(follow);
    }

    @Transactional
    public void unfollow(String email, Long artistId) {
        User user = getUserByEmail(email);
        followRepository.deleteByUserIdAndArtistId(user.getId(), artistId);
    }

    public List<ArtistResponse> getFollowedArtists(String email) {
        User user = getUserByEmail(email);
        return followRepository.findByUserId(user.getId()).stream()
                .map(f -> artistService.toResponse(f.getArtist()))
                .toList();
    }

    public boolean isFollowing(String email, Long artistId) {
        User user = getUserByEmail(email);
        return followRepository.findByUserIdAndArtistId(user.getId(), artistId).isPresent();
    }

    public long getFollowerCount(Long artistId) {
        return followRepository.countByArtistId(artistId);
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));
    }
}