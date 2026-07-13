package com.musify.backend.repository;

import com.musify.backend.entity.Album;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface AlbumRepository extends JpaRepository<Album, Long> {
    List<Album> findByArtistId(Long artistId);

    @Query("SELECT s.album FROM Song s WHERE s.album IS NOT NULL " +
            "GROUP BY s.album ORDER BY SUM(s.playCount) DESC")
    List<Album> findTopAlbumsByPlayCount(Pageable pageable);
}