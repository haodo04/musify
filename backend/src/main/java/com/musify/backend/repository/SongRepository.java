package com.musify.backend.repository;

import com.musify.backend.entity.Song;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SongRepository extends JpaRepository<Song, Long> {
    List<Song> findByAlbumId(Long albumId);
    List<Song> findByArtistId(Long artistId);
    List<Song> findByTitleContainingIgnoreCase(String keyword); // dùng cho Search sau này
}