package com.waterreport.technician;

import com.waterreport.common.ApiResponse;
import com.waterreport.technician.dto.TechnicianRequest;
import com.waterreport.technician.dto.TechnicianResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Technician management endpoints — Admin manages technician profiles,
 * technicians view their own info via /me (once auth is wired up, swap
 * the hard-coded parts for the authenticated principal's id).
 */
@RestController
@RequestMapping("/api/technicians")
public class TechnicianController {

    private final TechnicianService technicianService;

    public TechnicianController(TechnicianService technicianService) {
        this.technicianService = technicianService;
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<TechnicianResponse> addTechnician(@Valid @RequestBody TechnicianRequest request) {
        return ApiResponse.ok("Technician created", technicianService.addTechnician(request));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<List<TechnicianResponse>> getAllTechnicians() {
        return ApiResponse.ok("Technicians retrieved", technicianService.getAllTechnicians());
    }

    @GetMapping("/available")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<List<TechnicianResponse>> getAvailableTechnicians() {
        return ApiResponse.ok("Available technicians retrieved", technicianService.getAvailableTechnicians());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TECHNICIAN')")
    public ApiResponse<TechnicianResponse> getTechnicianById(@PathVariable Long id) {
        return ApiResponse.ok("Technician retrieved", technicianService.getTechnicianById(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<TechnicianResponse> updateTechnician(@PathVariable Long id, @Valid @RequestBody TechnicianRequest request) {
        return ApiResponse.ok("Technician updated", technicianService.updateTechnician(id, request));
    }

    @PatchMapping("/{id}/availability")
    @PreAuthorize("hasAnyRole('ADMIN', 'TECHNICIAN')")
    public ApiResponse<TechnicianResponse> updateAvailability(@PathVariable Long id, @RequestParam AvailabilityStatus status) {
        return ApiResponse.ok("Availability updated", technicianService.updateAvailability(id, status));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteTechnician(@PathVariable Long id) {
        technicianService.deleteTechnician(id);
    }
}
