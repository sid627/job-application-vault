package com.jobapplicationvault.backend.service;

import com.jobapplicationvault.backend.dto.JobApplicationRequest;
import com.jobapplicationvault.backend.dto.JobApplicationResponse;
import com.jobapplicationvault.backend.dto.UpdateJobStatusRequest;
import com.jobapplicationvault.backend.entity.ApplicationStatus;
import com.jobapplicationvault.backend.entity.JobApplication;
import com.jobapplicationvault.backend.exception.JobApplicationNotFoundException;
import com.jobapplicationvault.backend.repository.JobApplicationRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class JobApplicationService {

    private final JobApplicationRepository repository;

    public JobApplicationService(JobApplicationRepository repository) {
        this.repository = repository;
    }

    @Transactional
    public JobApplicationResponse save(JobApplicationRequest request) {
        JobApplication jobApplication = new JobApplication(
                request.jobTitle(),
                request.companyName(),
                request.location(),
                request.jobUrl(),
                request.description(),
                ApplicationStatus.SAVED
        );
        return JobApplicationResponse.from(repository.save(jobApplication));
    }

    @Transactional(readOnly = true)
    public List<JobApplicationResponse> findAll() {
        return repository.findAll(Sort.by(Sort.Direction.DESC, "savedAt"))
                .stream()
                .map(JobApplicationResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public JobApplicationResponse findById(Long id) {
        return repository.findById(id)
                .map(JobApplicationResponse::from)
                .orElseThrow(() -> new JobApplicationNotFoundException(id));
    }

    @Transactional
    public JobApplicationResponse updateStatus(Long id, UpdateJobStatusRequest request) {
        JobApplication jobApplication = repository.findById(id)
                .orElseThrow(() -> new JobApplicationNotFoundException(id));

        jobApplication.changeStatus(request.status());
        return JobApplicationResponse.from(repository.save(jobApplication));
    }
}
