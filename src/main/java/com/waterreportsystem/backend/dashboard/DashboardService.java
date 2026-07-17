package com.waterreport.dashboard;

import com.waterreport.assignment.ReportAssignmentService;
import com.waterreport.dashboard.dto.DashboardStatsResponse;
import com.waterreport.dashboard.dto.TechnicianWorkloadSummary;
import com.waterreport.report.ReportStatus;
import com.waterreport.report.WaterReportRepository;
import com.waterreport.technician.AvailabilityStatus;
import com.waterreport.technician.Technician;
import com.waterreport.technician.TechnicianRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    private final WaterReportRepository waterReportRepository;
    private final TechnicianRepository technicianRepository;
    private final ReportAssignmentService assignmentService;

    public DashboardService(WaterReportRepository waterReportRepository,
                             TechnicianRepository technicianRepository,
                             ReportAssignmentService assignmentService) {
        this.waterReportRepository = waterReportRepository;
        this.technicianRepository = technicianRepository;
        this.assignmentService = assignmentService;
    }

    public DashboardStatsResponse getStats() {
        DashboardStatsResponse stats = new DashboardStatsResponse();

        stats.setTotalReports(waterReportRepository.count());
        stats.setReportedCount(waterReportRepository.countByStatus(ReportStatus.REPORTED));
        stats.setAssignedCount(waterReportRepository.countByStatus(ReportStatus.ASSIGNED));
        stats.setInProgressCount(waterReportRepository.countByStatus(ReportStatus.IN_PROGRESS));
        stats.setResolvedCount(waterReportRepository.countByStatus(ReportStatus.RESOLVED));
        stats.setRejectedCount(waterReportRepository.countByStatus(ReportStatus.REJECTED));

        stats.setTotalTechnicians(technicianRepository.count());
        stats.setAvailableTechnicians(technicianRepository.countByAvailabilityStatus(AvailabilityStatus.AVAILABLE));
        stats.setBusyTechnicians(technicianRepository.countByAvailabilityStatus(AvailabilityStatus.BUSY));
        stats.setOffDutyTechnicians(technicianRepository.countByAvailabilityStatus(AvailabilityStatus.OFF_DUTY));

        List<TechnicianWorkloadSummary> workloads = technicianRepository.findAll().stream()
                .map(this::toWorkloadSummary)
                .collect(Collectors.toList());
        stats.setTechnicianWorkloads(workloads);

        return stats;
    }

    private TechnicianWorkloadSummary toWorkloadSummary(Technician t) {
        String fullName = t.getUser() != null
                ? t.getUser().getFirstName() + " " + t.getUser().getLastName()
                : null;
        long activeAssignments = assignmentService.getWorkloadCount(t.getId());
        return new TechnicianWorkloadSummary(
                t.getId(), t.getEmployeeNumber(), fullName, t.getAvailabilityStatus(), activeAssignments
        );
    }
}
