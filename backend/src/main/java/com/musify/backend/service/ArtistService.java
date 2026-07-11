package com.musify.backend.service;

import com.musify.backend.dto.response.ArtistResponse;
import com.musify.backend.entity.Artist;
import com.musify.backend.repository.ArtistRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ArtistService {

    private final ArtistRepository artistRepository;

    public ArtistService(ArtistRepository artistRepository) {
        this.artistRepository = artistRepository;
    }

    public List<ArtistResponse> getAllArtists() {
        return artistRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    public ArtistResponse getArtistById(Long id) {
        Artist artist = artistRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Khong tim thay artist"));
        return toResponse(artist);
    }

    private ArtistResponse toResponse(Artist artist) {
        return new ArtistResponse(artist.getId(), artist.getName(), artist.getAvatarUrl());
    }
}