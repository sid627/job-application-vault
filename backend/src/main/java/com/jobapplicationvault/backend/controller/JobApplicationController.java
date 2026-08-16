package com.jobapplicationvault.backend.controller;

import com.jobapplicationvault.backend.dto.JobApplicationRequest;
import com.jobapplicationvault.backend.dto.JobApplicationResponse;
import com.jobapplicationvault.backend.dto.UpdateJobStatusRequest;
import com.jobapplicationvault.backend.service.JobApplicationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
public class JobApplicationController {

    private final JobApplicationService service;

    public JobApplicationController(JobApplicationService service) {
        this.service = service;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public JobApplicationResponse save(@Valid @RequestBody JobApplicationRequest request) {
        return service.save(request);
    }

    @GetMapping
    public List<JobApplicationResponse> findAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public JobApplicationResponse findById(@PathVariable Long id) {
        return service.findById(id);
    }

    @PutMapping("/{id}/status")
    public JobApplicationResponse updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateJobStatusRequest request) {
        return service.updateStatus(id, request);
    }
}
