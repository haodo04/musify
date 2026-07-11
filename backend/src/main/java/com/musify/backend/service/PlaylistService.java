package com.musify.backend.service;

import com.musify.backend.dto.request.PlaylistRequest;
import com.musify.backend.dto.response.ArtistResponse;
import com.musify.backend.dto.response.PlaylistResponse;
import com.musify.backend.dto.response.SongResponse;
import com.musify.backend.entity.*;
import com.musify.backend.repository.*;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PlaylistService {

    private final PlaylistRepository playlistRepository;
    private final PlaylistSongRepository playlistSongRepository;
    private final SongRepository songRepository;
    private final UserRepository userRepository;

    public PlaylistService(PlaylistRepository playlistRepository,
                           PlaylistSongRepository playlistSongRepository,
                           SongRepository songRepository,
                           UserRepository userRepository) {
        this.playlistRepository = playlistRepository;
        this.playlistSongRepository = playlistSongRepository;
        this.songRepository = songRepository;
        this.userRepository = userRepository;
    }

    public PlaylistResponse createPlaylist(String userEmail, PlaylistRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Khong tim thay user"));

        Playlist playlist = Playlist.builder()
                .name(request.getName())
                .description(request.getDescription())
                .isPublic(request.isPublic())
                .user(user)
                .build();

        playlistRepository.save(playlist);
        return toResponse(playlist);
    }

    public List<PlaylistResponse> getMyPlaylists(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Khong tim thay user"));

        return playlistRepository.findByUserId(user.getId()).stream()
                .map(this::toResponse)
                .toList();
    }

    public PlaylistResponse getPlaylistById(Long id) {
        Playlist playlist = playlistRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Khong tim thay playlist"));
        return toResponse(playlist);
    }

    public void addSongToPlaylist(Long playlistId, Long songId) {
        Playlist playlist = playlistRepository.findById(playlistId)
                .orElseThrow(() -> new RuntimeException("Khong tim thay playlist"));
        Song song = songRepository.findById(songId)
                .orElseThrow(() -> new RuntimeException("Khong tim thay song"));

        boolean exists = playlistSongRepository.findByPlaylistIdAndSongId(playlistId, songId).isPresent();
        if (exists) {
            throw new RuntimeException("Bai hat da co trong playlist");
        }

        PlaylistSong playlistSong = PlaylistSong.builder()
                .playlist(playlist)
                .song(song)
                .build();

        playlistSongRepository.save(playlistSong);
    }

    public void removeSongFromPlaylist(Long playlistId, Long songId) {
        playlistSongRepository.deleteByPlaylistIdAndSongId(playlistId, songId);
    }

    public void deletePlaylist(Long playlistId) {
        playlistRepository.deleteById(playlistId);
    }

    private PlaylistResponse toResponse(Playlist playlist) {
        List<SongResponse> songs = playlistSongRepository.findByPlaylistId(playlist.getId()).stream()
                .map(ps -> {
                    Song song = ps.getSong();
                    ArtistResponse artistResponse = new ArtistResponse(
                            song.getArtist().getId(),
                            song.getArtist().getName(),
                            song.getArtist().getAvatarUrl()
                    );
                    Long albumId = song.getAlbum() != null ? song.getAlbum().getId() : null;
                    return new SongResponse(
                            song.getId(), song.getTitle(), song.getAudioUrl(),
                            song.getImageUrl(), song.getDuration(), song.getGenre(),
                            artistResponse, albumId
                    );
                })
                .toList();

        return new PlaylistResponse(
                playlist.getId(),
                playlist.getName(),
                playlist.getDescription(),
                playlist.getCoverUrl(),
                playlist.isPublic(),
                songs
        );
    }
}