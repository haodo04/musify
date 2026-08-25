package com.musify.backend.service;

import com.musify.backend.dto.request.ArtistRequest;
import com.musify.backend.dto.response.ArtistResponse;
import com.musify.backend.entity.Artist;
import com.musify.backend.repository.ArtistRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ArtistService {

    private final ArtistRepository artistRepository;
    private final CloudinaryService cloudinaryService;

    public ArtistResponse createArtist(ArtistRequest request) throws IOException {
        String avatarUrl = null;
        if (request.getAvatarFile() != null && !request.getAvatarFile().isEmpty()) {
            avatarUrl = cloudinaryService.uploadImage(request.getAvatarFile());
        }

        Artist artist = Artist.builder()
                .name(request.getName())
                .bio(request.getBio())
                .avatarUrl(avatarUrl)
                .build();

        artistRepository.save(artist);
        return toResponse(artist);
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
        return new ArtistResponse(artist.getId(), artist.getName(), artist.getAvatarUrl(), artist.getBannerUrl() ,artist.getBio());
    }

    @Transactional
    public void deleteArtist(Long id) {
        if (!artistRepository.existsById(id)) {
            throw new RuntimeException("Khong tim thay artist");
        }
        try {
            artistRepository.deleteById(id);
        } catch (DataIntegrityViolationException e) {
            throw new RuntimeException("Không thể xoá nghệ sĩ này vì vẫn còn bài hát hoặc album thuộc về nghệ sĩ");
        }
    }
}