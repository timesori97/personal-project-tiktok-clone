package com.example.project1.service;

import com.example.project1.mapper.AdminMapper;
import com.example.project1.dao.VideoDAO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {
    private final AdminMapper adminMapper;
    private final VideoDAO videoDAO;

    @Override
    public Map<String, Object> getDashboardStats() { return adminMapper.getSystemStats(); }

    @Override
    public List<Map<String, Object>> getReports() { return adminMapper.findAllReports(); }

    @Override
    @Transactional
    public void processReport(Long reportId, Long targetId, String type, String action) {
        adminMapper.updateReportStatus(reportId, "RESOLVED");
        if ("VIDEO".equalsIgnoreCase(type) && "DELETE".equalsIgnoreCase(action)) {
            videoDAO.deleteVideo(targetId); // XML에서 update videos set deleted_yn='Y' 실행됨
        }
    }
}