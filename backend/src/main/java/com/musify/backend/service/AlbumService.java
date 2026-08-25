package com.musify.backend.service;

import com.musify.backend.dto.request.AlbumRequest;
import com.musify.backend.dto.response.AlbumResponse;
import com.musify.backend.dto.response.ArtistResponse;
import com.musify.backend.entity.Album;
import com.musify.backend.entity.Artist;
import com.musify.backend.repository.AlbumRepository;
import com.musify.backend.repository.ArtistRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AlbumService {

    private final AlbumRepository albumRepository;
    private final ArtistRepository artistRepository;
    private final CloudinaryService cloudinaryService;

    public AlbumResponse createAlbum(AlbumRequest request) throws IOException {
        Artist artist = artistRepository.findById(request.getArtistId())
                .orElseThrow(() -> new RuntimeException("Khong tim thay artist"));

        String coverUrl = null;
        if (request.getCoverFile() != null && !request.getCoverFile().isEmpty()) {
            coverUrl = cloudinaryService.uploadImage(request.getCoverFile());
        }

        Album album = Album.builder()
                .title(request.getTitle())
                .coverUrl(coverUrl)
                .releaseDate(request.getReleaseDate())
                .artist(artist)
                .build();

        albumRepository.save(album);
        return toResponse(album);
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
                album.getArtist().getAvatarUrl(),
                album.getArtist().getBannerUrl(),
                album.getArtist().getBio()
        );
        return new AlbumResponse(
                album.getId(),
                album.getTitle(),
                album.getCoverUrl(),
                album.getReleaseDate(),
                artistResponse
        );
    }

    public List<AlbumResponse> getFeaturedCharts() {
        return albumRepository.findTopAlbumsByPlayCount(PageRequest.of(0, 10)).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public void deleteAlbum(Long id) {
        if (!albumRepository.existsById(id)) {
            throw new RuntimeException("Khong tim thay album");
        }
        try {
            albumRepository.deleteById(id);
        } catch (DataIntegrityViolationException e) {
            throw new RuntimeException("Không thể xoá album này vì vẫn còn bài hát thuộc album");
        }
    }
}