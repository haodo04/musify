package com.musify.backend.service;

import com.musify.backend.dto.response.ArtistResponse;
import com.musify.backend.dto.response.SongResponse;
import com.musify.backend.entity.Song;
import com.musify.backend.repository.SongRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SongService {

    private final SongRepository songRepository;

    public SongService(SongRepository songRepository) {
        this.songRepository = songRepository;
    }

    public List<SongResponse> getAllSongs() {
        return songRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    public SongResponse getSongById(Long id) {
        Song song = songRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Khong tim thay song"));
        return toResponse(song);
    }

    public List<SongResponse> getSongsByAlbumId(Long albumId) {
        return songRepository.findByAlbumId(albumId).stream()
                .map(this::toResponse)
                .toList();
    }

    public List<SongResponse> searchSongs(String keyword) {
        return songRepository.findByTitleContainingIgnoreCase(keyword).stream()
                .map(this::toResponse)
                .toList();
    }

    private SongResponse toResponse(Song song) {
        ArtistResponse artistResponse = new ArtistResponse(
                song.getArtist().getId(),
                song.getArtist().getName(),
                song.getArtist().getAvatarUrl()
        );
        Long albumId = song.getAlbum() != null ? song.getAlbum().getId() : null;
        return new SongResponse(
                song.getId(),
                song.getTitle(),
                song.getAudioUrl(),
                song.getImageUrl(),
                song.getDuration(),
                song.getGenre(),
                artistResponse,
                albumId
        );
    }
}