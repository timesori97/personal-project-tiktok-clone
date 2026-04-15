package com.example.project1.mapper;

import com.example.project1.entity.Video;
import com.example.project1.entity.VideoComment;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;

@Mapper
public interface InteractionMapper {
    // 1. 좋아요
    int checkLiked(@Param("userId") Long userId, @Param("videoId") Long videoId);
    void insertLike(@Param("userId") Long userId, @Param("videoId") Long videoId);
    void deleteLike(@Param("userId") Long userId, @Param("videoId") Long videoId);
    int countLikes(@Param("videoId") Long videoId);
    int getTotalLikesReceived(@Param("userId") Long userId);

    // 2. 댓글
    List<VideoComment> getComments(@Param("videoId") Long videoId);
    void insertComment(@Param("userId") Long userId, @Param("videoId") Long videoId, @Param("content") String content);

    // 3. 북마크
    int checkBookmarked(@Param("userId") Long userId, @Param("videoId") Long videoId);
    void insertBookmark(@Param("userId") Long userId, @Param("videoId") Long videoId);
    void deleteBookmark(@Param("userId") Long userId, @Param("videoId") Long videoId);
    List<Video> getBookmarkedVideos(@Param("userId") Long userId);

    // 4. 팔로우
    int checkFollow(@Param("followerId") Long followerId, @Param("followingId") Long followingId);
    void insertFollow(@Param("followerId") Long followerId, @Param("followingId") Long followingId);
    void deleteFollow(@Param("followerId") Long followerId, @Param("followingId") Long followingId);
    int countFollowers(@Param("userId") Long userId);
    int countFollowing(@Param("userId") Long userId);

    void insertReport(
        @Param("reporterId") Long reporterId, 
        @Param("targetType") String targetType, 
        @Param("targetId") Long targetId, 
        @Param("reason") String reason
    );
}