package com.waterreportsystem.backend.dashboard;

import com.waterreportsystem.backend.response.ApiResponse;
import com.waterreportsystem.backend.dashboard.dto.DashboardStatsResponse;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<DashboardStatsResponse> getStats() {
        return ApiResponse.ok("Dashboard stats retrieved", dashboardService.getStats());
    }
}
