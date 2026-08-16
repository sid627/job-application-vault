package com.jobapplicationvault.backend.exception;

public class JobApplicationNotFoundException extends RuntimeException {

    public JobApplicationNotFoundException(Long id) {
        super("Job application with id " + id + " was not found");
    }
}
