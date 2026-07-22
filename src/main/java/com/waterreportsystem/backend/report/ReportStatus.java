package com.waterreport.report;

/**
 * Shared status enum used by WaterReport (Member 3) and by this module's
 * StatusUpdate / ReportAssignment logic. Keep this in sync with whatever
 * Member 3 names their enum — ideally you agree on ONE ReportStatus enum
 * and both modules import it from here.
 */
public enum ReportStatus {
    ACCEPTED,
    REPORTED,
    ASSIGNED,
    IN_PROGRESS,
    RESOLVED,
    REJECTED
}
