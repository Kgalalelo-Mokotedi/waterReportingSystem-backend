package com.waterreportsystem.backend.assignment;

import com.waterreportsystem.backend.assignment.dto.AssignTechnicianRequest;
import com.waterreportsystem.backend.assignment.dto.AssignmentResponse;
import com.waterreportsystem.backend.response.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/assignments")
public class ReportAssignmentController {

    private final com.waterreportsystem.backend.assignment.ReportAssignmentService assignmentService;

    public ReportAssignmentController(com.waterreportsystem.backend.assignment.ReportAssignmentService assignmentService) {
        this.assignmentService = assignmentService;
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<AssignmentResponse> assignTechnician(@Valid @RequestBody AssignTechnicianRequest request) {
        return ApiResponse.ok("Technician assigned", assignmentService.assignTechnician(request));
    }

    @GetMapping("/technician/{technicianId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TECHNICIAN')")
    public ApiResponse<List<AssignmentResponse>> getAssignmentsForTechnician(@PathVariable Long technicianId) {
        return ApiResponse.ok("Assignments retrieved", assignmentService.getAssignmentsForTechnician(technicianId));
    }

    @GetMapping("/technician/{technicianId}/active")
    @PreAuthorize("hasAnyRole('ADMIN', 'TECHNICIAN')")
    public ApiResponse<List<AssignmentResponse>> getActiveAssignmentsForTechnician(@PathVariable Long technicianId) {
        return ApiResponse.ok("Active assignments retrieved", assignmentService.getActiveAssignmentsForTechnician(technicianId));
    }

    @GetMapping("/technician/{technicianId}/workload")
    @PreAuthorize("hasAnyRole('ADMIN', 'TECHNICIAN')")
    public ApiResponse<Long> getWorkloadCount(@PathVariable Long technicianId) {
        return ApiResponse.ok("Workload retrieved", assignmentService.getWorkloadCount(technicianId));
    }

    @GetMapping("/report/{reportId}/history")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<List<AssignmentResponse>> getAssignmentHistoryForReport(@PathVariable Long reportId) {
        return ApiResponse.ok("Assignment history retrieved", assignmentService.getAssignmentHistoryForReport(reportId));
    }

    @PatchMapping("/{id}/start")
    @PreAuthorize("hasAnyRole('ADMIN', 'TECHNICIAN')")
    public ApiResponse<AssignmentResponse> markInProgress(@PathVariable Long id) {
        return ApiResponse.ok("Assignment marked in progress", assignmentService.markInProgress(id));
    }

    @PatchMapping("/{id}/complete")
    @PreAuthorize("hasAnyRole('ADMIN', 'TECHNICIAN')")
    public ApiResponse<AssignmentResponse> completeAssignment(@PathVariable Long id) {
        return ApiResponse.ok("Assignment completed", assignmentService.completeAssignment(id));
    }

    @PatchMapping("/{id}/cancel")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<AssignmentResponse> cancelAssignment(@PathVariable Long id) {
        return ApiResponse.ok("Assignment cancelled", assignmentService.cancelAssignment(id));
    }
}
