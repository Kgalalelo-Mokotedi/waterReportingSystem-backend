package com.waterreportsystem.backend.statusupdate;

import com.waterreportsystem.backend.response.ApiResponse;
import com.waterreportsystem.backend.statusupdate.dto.StatusUpdateRequest;
import com.waterreportsystem.backend.statusupdate.dto.StatusUpdateResponse;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/status-updates")
public class StatusUpdateController {

    private final StatusUpdateService statusUpdateService;

    public StatusUpdateController(StatusUpdateService statusUpdateService) {
        this.statusUpdateService = statusUpdateService;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'TECHNICIAN')")
    public ApiResponse<StatusUpdateResponse> logStatusUpdate(@Valid @RequestBody StatusUpdateRequest request) {
        return ApiResponse.ok("Status update logged", statusUpdateService.logStatusUpdate(request));
    }

    @GetMapping("/report/{reportId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TECHNICIAN', 'RESIDENT')")
    public ApiResponse<List<StatusUpdateResponse>> getHistoryForReport(@PathVariable Long reportId) {
        return ApiResponse.ok("Status history retrieved", statusUpdateService.getHistoryForReport(reportId));
    }

    @GetMapping("/technician/{technicianId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TECHNICIAN')")
    public ApiResponse<List<StatusUpdateResponse>> getUpdatesByTechnician(@PathVariable Long technicianId) {
        return ApiResponse.ok("Technician's updates retrieved", statusUpdateService.getUpdatesByTechnician(technicianId));
    }
}
