package com.jobapplicationvault.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record JobApplicationRequest(
        @NotBlank(message = "Job title is required")
        @Size(max = 255, message = "Job title must not exceed 255 characters")
        String jobTitle,

        @NotBlank(message = "Company name is required")
        @Size(max = 255, message = "Company name must not exceed 255 characters")
        String companyName,

        @Size(max = 255, message = "Location must not exceed 255 characters")
        String location,

        @NotBlank(message = "Job URL is required")
        @Size(max = 2048, message = "Job URL must not exceed 2048 characters")
        String jobUrl,

        String description
) {
}
