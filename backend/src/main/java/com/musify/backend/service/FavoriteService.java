package com.musify.backend.service;

import com.musify.backend.dto.response.SongResponse;
import com.musify.backend.entity.Favorite;
import com.musify.backend.entity.Song;
import com.musify.backend.entity.User;
import com.musify.backend.repository.FavoriteRepository;
import com.musify.backend.repository.SongRepository;
import com.musify.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FavoriteService {

    private final FavoriteRepository favoriteRepository;
    private final SongRepository songRepository;
    private final UserRepository userRepository;
    private final SongService songService;

    @Transactional
    public void addFavorite(String email, Long songId) {
        User user = getUserByEmail(email);
        Song song = songRepository.findById(songId)
                .orElseThrow(() -> new RuntimeException("Khong tim thay song"));

        if (favoriteRepository.findByUserIdAndSongId(user.getId(), songId).isPresent()) {
            return;
        }

        Favorite favorite = Favorite.builder()
                .user(user)
                .song(song)
                .build();
        favoriteRepository.save(favorite);
    }

    @Transactional
    public void removeFavorite(String email, Long songId) {
        User user = getUserByEmail(email);
        favoriteRepository.deleteByUserIdAndSongId(user.getId(), songId);
    }

    public List<SongResponse> getMyFavorites(String email) {
        User user = getUserByEmail(email);
        return favoriteRepository.findByUserId(user.getId()).stream()
                .map(fav -> songService.toResponse(fav.getSong()))
                .toList();
    }

    public boolean isFavorite(String email, Long songId) {
        User user = getUserByEmail(email);
        return favoriteRepository.findByUserIdAndSongId(user.getId(), songId).isPresent();
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Khong tim thay user"));
    }
}