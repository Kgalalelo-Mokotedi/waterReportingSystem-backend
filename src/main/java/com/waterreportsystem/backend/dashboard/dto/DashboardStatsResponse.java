package com.waterreportsystem.backend.dashboard.dto;

import java.util.List;

/** Top-level admin dashboard summary. */
public class DashboardStatsResponse {

    private long totalReports;
    private long reportedCount;
    private long assignedCount;
    private long inProgressCount;
    private long resolvedCount;
    private long rejectedCount;

    private long totalTechnicians;
    private long availableTechnicians;
    private long busyTechnicians;
    private long offDutyTechnicians;

    private List<TechnicianWorkloadSummary> technicianWorkloads;

    public long getTotalReports() { return totalReports; }
    public void setTotalReports(long totalReports) { this.totalReports = totalReports; }

    public long getReportedCount() { return reportedCount; }
    public void setReportedCount(long reportedCount) { this.reportedCount = reportedCount; }

    public long getAssignedCount() { return assignedCount; }
    public void setAssignedCount(long assignedCount) { this.assignedCount = assignedCount; }

    public long getInProgressCount() { return inProgressCount; }
    public void setInProgressCount(long inProgressCount) { this.inProgressCount = inProgressCount; }

    public long getResolvedCount() { return resolvedCount; }
    public void setResolvedCount(long resolvedCount) { this.resolvedCount = resolvedCount; }

    public long getRejectedCount() { return rejectedCount; }
    public void setRejectedCount(long rejectedCount) { this.rejectedCount = rejectedCount; }

    public long getTotalTechnicians() { return totalTechnicians; }
    public void setTotalTechnicians(long totalTechnicians) { this.totalTechnicians = totalTechnicians; }

    public long getAvailableTechnicians() { return availableTechnicians; }
    public void setAvailableTechnicians(long availableTechnicians) { this.availableTechnicians = availableTechnicians; }

    public long getBusyTechnicians() { return busyTechnicians; }
    public void setBusyTechnicians(long busyTechnicians) { this.busyTechnicians = busyTechnicians; }

    public long getOffDutyTechnicians() { return offDutyTechnicians; }
    public void setOffDutyTechnicians(long offDutyTechnicians) { this.offDutyTechnicians = offDutyTechnicians; }

    public List<TechnicianWorkloadSummary> getTechnicianWorkloads() { return technicianWorkloads; }
    public void setTechnicianWorkloads(List<TechnicianWorkloadSummary> technicianWorkloads) { this.technicianWorkloads = technicianWorkloads; }
}
