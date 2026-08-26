package com.musify.backend.repository;

import com.musify.backend.entity.Follow;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FollowRepository extends JpaRepository<Follow, Long> {
    List<Follow> findByUserId(Long userId);
    Optional<Follow> findByUserIdAndArtistId(Long userId, Long artistId);
    void deleteByUserIdAndArtistId(Long userId, Long artistId);
    long countByArtistId(Long artistId);
}