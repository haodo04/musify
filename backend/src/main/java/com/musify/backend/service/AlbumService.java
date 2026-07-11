package com.musify.backend.service;

import com.musify.backend.dto.response.AlbumResponse;
import com.musify.backend.dto.response.ArtistResponse;
import com.musify.backend.entity.Album;
import com.musify.backend.repository.AlbumRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AlbumService {

    private final AlbumRepository albumRepository;

    public AlbumService(AlbumRepository albumRepository) {
        this.albumRepository = albumRepository;
    }

    public List<AlbumResponse> getAllAlbums() {
        return albumRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    public AlbumResponse getAlbumById(Long id) {
        Album album = albumRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Khong tim thay album"));
        return toResponse(album);
    }

    private AlbumResponse toResponse(Album album) {
        ArtistResponse artistResponse = new ArtistResponse(
                album.getArtist().getId(),
                album.getArtist().getName(),
                album.getArtist().getAvatarUrl()
        );
        return new AlbumResponse(
                album.getId(),
                album.getTitle(),
                album.getCoverUrl(),
                album.getReleaseDate(),
                artistResponse
        );
    }
}