package com.example.project1.controller;

import com.example.project1.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() { 
        return ResponseEntity.ok(adminService.getDashboardStats()); 
    }

    @GetMapping("/reports")
    public ResponseEntity<List<Map<String, Object>>> getReports() { 
        return ResponseEntity.ok(adminService.getReports()); 
    }

    @PostMapping("/reports/{id}/process")
    public ResponseEntity<String> process(@PathVariable("id") Long id, @RequestBody Map<String, Object> params) {
        try {
            adminService.processReport(id, 
                Long.parseLong(params.get("targetId").toString()), 
                params.get("type").toString(), 
                params.get("action").toString());
            return ResponseEntity.ok("Success");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error processing report");
        }
    }
}