package com.example.project1.service;

import java.util.List;
import java.util.Map;

public interface AdminService {
    Map<String, Object> getDashboardStats();

    // 💡 [수정] 여기도 List<Map<String, Object>>로 변경!
    List<Map<String, Object>> getReports();

    void processReport(Long reportId, Long targetId, String type, String action);
}