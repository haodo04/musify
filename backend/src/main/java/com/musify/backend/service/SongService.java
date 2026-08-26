package com.musify.backend.service;

import com.musify.backend.dto.request.SongUploadRequest;
import com.musify.backend.dto.response.ArtistResponse;
import com.musify.backend.dto.response.SongResponse;
import com.musify.backend.entity.Album;
import com.musify.backend.entity.Artist;
import com.musify.backend.entity.Favorite;
import com.musify.backend.entity.Song;
import com.musify.backend.repository.AlbumRepository;
import com.musify.backend.repository.ArtistRepository;
import com.musify.backend.repository.FavoriteRepository;
import com.musify.backend.repository.SongRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.AbstractMap;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SongService {

    private final SongRepository songRepository;
    private final CloudinaryService cloudinaryService;
    private final ArtistRepository artistRepository;
    private final AlbumRepository albumRepository;
    private final FavoriteRepository favoriteRepository;
    private final GeminiEmbeddingService geminiEmbeddingService;
    private final ObjectMapper objectMapper = new ObjectMapper();

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

        try {
            String description = song.getTitle() + " " + artist.getName() + " " + song.getGenre();
            List<Double> vector = geminiEmbeddingService.embed(description);
            song.setEmbedding(objectMapper.writeValueAsString(vector));
            songRepository.save(song);
        } catch (Exception e) {
            System.err.println("Loi sinh embedding cho bai hat id=" + song.getId() + ": " + e.getMessage());
        }

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

    public SongResponse toResponse(Song song) {
        ArtistResponse artistResponse = new ArtistResponse(
                song.getArtist().getId(),
                song.getArtist().getName(),
                song.getArtist().getAvatarUrl(),
                song.getArtist().getBannerUrl(),
                song.getArtist().getBio()
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

    @Transactional
    public void incrementPlayCount(Long songId) {
        Song song = songRepository.findById(songId)
                .orElseThrow(() -> new RuntimeException("Khong tim thay song"));
        song.setPlayCount(song.getPlayCount() + 1);
        songRepository.save(song);
    }

    public List<SongResponse> getTrendingSongs() {
        return songRepository.findTop10ByOrderByPlayCountDesc().stream()
                .map(this::toResponse)
                .toList();
    }

    public List<SongResponse> getSongsByArtistId(Long artistId) {
        List<Song> songs = songRepository.findByArtistId(artistId);

        return songs.stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public void deleteSong(Long id) {
        if (!songRepository.existsById(id)) {
            throw new RuntimeException("Khong tim thay song");
        }
        try {
            songRepository.deleteById(id);
        } catch (DataIntegrityViolationException e) {
            throw new RuntimeException("Không thể xoá bài hát này vì đang được dùng trong playlist hoặc danh sách yêu thích của người dùng");
        }
    }

    @Transactional
    public SongResponse updateSong(Long id, SongUploadRequest request) throws IOException {
        Song song = songRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Khong tim thay song"));

        Artist artist = artistRepository.findById(request.getArtistId())
                .orElseThrow(() -> new RuntimeException("Khong tim thay artist"));

        Album album = null;
        if (request.getAlbumId() != null) {
            album = albumRepository.findById(request.getAlbumId())
                    .orElseThrow(() -> new RuntimeException("Khong tim thay album"));
        }

        if (request.getAudioFile() != null && !request.getAudioFile().isEmpty()) {
            song.setAudioUrl(cloudinaryService.uploadAudio(request.getAudioFile()));
        }
        if (request.getImageFile() != null && !request.getImageFile().isEmpty()) {
            song.setImageUrl(cloudinaryService.uploadImage(request.getImageFile()));
        }

        song.setTitle(request.getTitle());
        song.setGenre(request.getGenre());
        song.setDuration(request.getDuration());
        song.setArtist(artist);
        song.setAlbum(album);

        songRepository.save(song);

        try {
            String description = song.getTitle() + " " + artist.getName() + " " + song.getGenre();
            List<Double> vector = geminiEmbeddingService.embed(description);
            song.setEmbedding(objectMapper.writeValueAsString(vector));
            songRepository.save(song);
        } catch (Exception e) {
            System.err.println("Loi sinh lai embedding cho bai hat id=" + song.getId() + ": " + e.getMessage());
        }

        return toResponse(song);
    }

    public List<SongResponse> searchSemantic(String query, int topK) {
        List<Double> queryVector = geminiEmbeddingService.embed(query);

        List<Song> allSongs = songRepository.findAll();

        return allSongs.stream()
                .filter(song -> song.getEmbedding() != null && !song.getEmbedding().isBlank())
                .map(song -> {
                    List<Double> songVector = parseEmbedding(song.getEmbedding());
                    double score = cosineSimilarity(queryVector, songVector);
                    return new AbstractMap.SimpleEntry<>(song, score);
                })
                .sorted(Comparator.comparingDouble((Map.Entry<Song, Double> e) -> e.getValue()).reversed())
                .limit(topK)
                .map(entry -> toResponse(entry.getKey()))
                .toList();
    }

    @Transactional
    public int backfillEmbeddings() {
        List<Song> songsWithoutEmbedding = songRepository.findAll().stream()
                .filter(s -> s.getEmbedding() == null || s.getEmbedding().isBlank())
                .toList();

        int successCount = 0;
        for (Song song : songsWithoutEmbedding) {
            try {
                String description = song.getTitle() + " " + song.getArtist().getName() + " " + song.getGenre();
                List<Double> vector = geminiEmbeddingService.embed(description);
                song.setEmbedding(objectMapper.writeValueAsString(vector));
                songRepository.save(song);
                successCount++;
            } catch (Exception e) {
                System.err.println("Bo qua bai hat id=" + song.getId() + ": " + e.getMessage());
            }
        }
        return successCount;
    }

    public List<SongResponse> getSimilarSongs(Long songId, int topK) {
        Song song = songRepository.findById(songId)
                .orElseThrow(() -> new RuntimeException("Khong tim thay song"));

        if (song.getEmbedding() == null || song.getEmbedding().isBlank()) {
            return List.of();
        }

        List<Double> targetVector = parseEmbedding(song.getEmbedding());

        return songRepository.findAll().stream()
                .filter(s -> !s.getId().equals(songId))
                .filter(s -> s.getEmbedding() != null && !s.getEmbedding().isBlank())
                .map(s -> new AbstractMap.SimpleEntry<>(s, cosineSimilarity(targetVector, parseEmbedding(s.getEmbedding()))))
                .sorted(Comparator.comparingDouble((Map.Entry<Song, Double> e) -> e.getValue()).reversed())
                .limit(topK)
                .map(entry -> toResponse(entry.getKey()))
                .toList();
    }

    public List<SongResponse> getPersonalizedRecommendations(Long userId, int topK) {
        List<Favorite> favorites = favoriteRepository.findByUserId(userId);

        List<List<Double>> favoriteVectors = favorites.stream()
                .map(Favorite::getSong)
                .filter(s -> s.getEmbedding() != null && !s.getEmbedding().isBlank())
                .map(s -> parseEmbedding(s.getEmbedding()))
                .toList();

        if (favoriteVectors.isEmpty()) {
            return getTrendingSongs();
        }

        List<Double> centroid = computeCentroid(favoriteVectors);

        Set<Long> favoritedSongIds = favorites.stream()
                .map(f -> f.getSong().getId())
                .collect(Collectors.toSet());

        return songRepository.findAll().stream()
                .filter(s -> !favoritedSongIds.contains(s.getId()))
                .filter(s -> s.getEmbedding() != null && !s.getEmbedding().isBlank())
                .map(s -> new AbstractMap.SimpleEntry<>(s, cosineSimilarity(centroid, parseEmbedding(s.getEmbedding()))))
                .sorted(Comparator.comparingDouble((Map.Entry<Song, Double> e) -> e.getValue()).reversed())
                .limit(topK)
                .map(entry -> toResponse(entry.getKey()))
                .toList();
    }

    private List<Double> computeCentroid(List<List<Double>> vectors) {
        int dim = vectors.get(0).size();
        double[] sum = new double[dim];
        for (List<Double> v : vectors) {
            for (int i = 0; i < dim; i++) {
                sum[i] += v.get(i);
            }
        }
        List<Double> centroid = new ArrayList<>();
        for (int i = 0; i < dim; i++) {
            centroid.add(sum[i] / vectors.size());
        }
        return centroid;
    }

    private List<Double> parseEmbedding(String embeddingJson) {
        try {
            return objectMapper.readValue(embeddingJson, new TypeReference<List<Double>>() {});
        } catch (Exception e) {
            throw new RuntimeException("Loi doc du lieu embedding: " + e.getMessage(), e);
        }
    }

    private double cosineSimilarity(List<Double> a, List<Double> b) {
        if (a.size() != b.size()) {
            return 0.0;
        }
        double dotProduct = 0.0, normA = 0.0, normB = 0.0;
        for (int i = 0; i < a.size(); i++) {
            dotProduct += a.get(i) * b.get(i);
            normA += a.get(i) * a.get(i);
            normB += b.get(i) * b.get(i);
        }
        if (normA == 0.0 || normB == 0.0) {
            return 0.0;
        }
        return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
    }
}