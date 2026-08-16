package com.jobapplicationvault.backend.dto;

import com.jobapplicationvault.backend.entity.ApplicationStatus;
import jakarta.validation.constraints.NotNull;

public record UpdateJobStatusRequest(
        @NotNull(message = "Status is required")
        ApplicationStatus status
) {
}
