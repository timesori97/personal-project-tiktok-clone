package com.example.project1.mapper;
import com.example.project1.entity.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;
import java.util.Map;

@Mapper
public interface AdminMapper {
    Map<String, Object> getSystemStats();
    List<Map<String, Object>> findAllReports(); // Map으로 통일
    int updateReportStatus(@Param("id") Long id, @Param("status") String status);
    List<User> findAllUsersForAdmin(); // 기존 기능
}