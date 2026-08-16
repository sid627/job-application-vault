package com.jobapplicationvault.backend.dto;

import com.jobapplicationvault.backend.entity.ApplicationStatus;
import com.jobapplicationvault.backend.entity.JobApplication;

import java.time.LocalDateTime;

public record JobApplicationResponse(
        Long id,
        String jobTitle,
        String companyName,
        String location,
        String jobUrl,
        String description,
        ApplicationStatus status,
        LocalDateTime savedAt,
        LocalDateTime appliedAt
) {
    public static JobApplicationResponse from(JobApplication jobApplication) {
        return new JobApplicationResponse(
                jobApplication.getId(),
                jobApplication.getJobTitle(),
                jobApplication.getCompanyName(),
                jobApplication.getLocation(),
                jobApplication.getJobUrl(),
                jobApplication.getDescription(),
                jobApplication.getStatus(),
                jobApplication.getSavedAt(),
                jobApplication.getAppliedAt()
        );
    }
}
