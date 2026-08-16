package com.jobapplicationvault.backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(HttpMessageNotReadableException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ApiError handleUnreadableRequest(HttpMessageNotReadableException exception) {
        return new ApiError(
                HttpStatus.BAD_REQUEST.value(),
                "Invalid request body or application status",
                Map.of(),
                LocalDateTime.now()
        );
    }

    @ExceptionHandler(JobApplicationNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ApiError handleNotFound(JobApplicationNotFoundException exception) {
        return new ApiError(
                HttpStatus.NOT_FOUND.value(),
                exception.getMessage(),
                Map.of(),
                LocalDateTime.now()
        );
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ApiError handleValidation(MethodArgumentNotValidException exception) {
        Map<String, String> errors = new LinkedHashMap<>();
        exception.getBindingResult().getFieldErrors()
                .forEach(error -> errors.putIfAbsent(error.getField(), error.getDefaultMessage()));

        return new ApiError(
                HttpStatus.BAD_REQUEST.value(),
                "Request validation failed",
                errors,
                LocalDateTime.now()
        );
    }
}
