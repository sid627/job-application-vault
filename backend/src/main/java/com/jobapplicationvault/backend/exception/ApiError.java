package com.jobapplicationvault.backend.exception;

import java.time.LocalDateTime;
import java.util.Map;

public record ApiError(
        int status,
        String message,
        Map<String, String> validationErrors,
        LocalDateTime timestamp
) {
}
