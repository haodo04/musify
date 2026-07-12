package com.musify.backend.service;

import com.musify.backend.dto.request.SongUploadRequest;
import com.musify.backend.dto.response.ArtistResponse;
import com.musify.backend.dto.response.SongResponse;
import com.musify.backend.entity.Album;
import com.musify.backend.entity.Artist;
import com.musify.backend.entity.Song;
import com.musify.backend.repository.AlbumRepository;
import com.musify.backend.repository.ArtistRepository;
import com.musify.backend.repository.SongRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SongService {

    private final SongRepository songRepository;
    private final CloudinaryService cloudinaryService;
    private final ArtistRepository artistRepository;
    private final AlbumRepository albumRepository;


    public SongResponse uploadSong(SongUploadRequest request) throws IOException {
        Artist artist = artistRepository.findById(request.getArtistId())
                .orElseThrow(() -> new RuntimeException("Khong tim thay artist"));

        Album album = null;
        if (request.getAlbumId() != null) {
            album = albumRepository.findById(request.getAlbumId())
                    .orElseThrow(() -> new RuntimeException("Khong tim thay album"));
        }

        String audioUrl = cloudinaryService.uploadAudio(request.getAudioFile());
        String imageUrl = request.getImageFile() != null
                ? cloudinaryService.uploadImage(request.getImageFile())
                : null;
        Song song = Song.builder()
                .title(request.getTitle())
                .genre(request.getGenre())
                .duration(request.getDuration())
                .audioUrl(audioUrl)
                .imageUrl(imageUrl)
                .artist(artist)
                .album(album)
                .build();

        songRepository.save(song);
        return toResponse(song);
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