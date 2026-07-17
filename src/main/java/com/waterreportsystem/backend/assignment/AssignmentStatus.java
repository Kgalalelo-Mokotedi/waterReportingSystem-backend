package com.waterreport.assignment;

/**
 * Tracks the assignment's own lifecycle — separate from ReportStatus
 * (which tracks the underlying WaterReport's repair progress).
 */
public enum AssignmentStatus {
    ASSIGNED,
    ACCEPTED,
    IN_PROGRESS,
    COMPLETED,
    REASSIGNED,
    CANCELLED
}
