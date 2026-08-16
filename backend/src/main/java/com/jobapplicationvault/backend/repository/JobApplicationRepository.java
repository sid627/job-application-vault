package com.jobapplicationvault.backend.repository;

import com.jobapplicationvault.backend.entity.JobApplication;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {
}
