package com.jobapplicationvault.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

import java.time.LocalDateTime;

@Entity
@Table(name = "job_applications")
public class JobApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "job_title", nullable = false)
    private String jobTitle;

    @Column(name = "company_name", nullable = false)
    private String companyName;

    private String location;

    @Column(name = "job_url", nullable = false, length = 2048)
    private String jobUrl;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ApplicationStatus status = ApplicationStatus.SAVED;

    @Column(name = "saved_at", nullable = false, updatable = false)
    private LocalDateTime savedAt;

    @Column(name = "applied_at")
    private LocalDateTime appliedAt;

    protected JobApplication() {
    }

    public JobApplication(String jobTitle, String companyName, String location, String jobUrl,
                          String description, ApplicationStatus status) {
        this.jobTitle = jobTitle;
        this.companyName = companyName;
        this.location = location;
        this.jobUrl = jobUrl;
        this.description = description;
        this.status = status == null ? ApplicationStatus.SAVED : status;
    }

    @PrePersist
    void setSavedAt() {
        if (savedAt == null) {
            savedAt = LocalDateTime.now();
        }
    }

    public void changeStatus(ApplicationStatus status) {
        if (status == ApplicationStatus.APPLIED && appliedAt == null) {
            appliedAt = LocalDateTime.now();
        }
        this.status = status;
    }

    public Long getId() { return id; }
    public String getJobTitle() { return jobTitle; }
    public String getCompanyName() { return companyName; }
    public String getLocation() { return location; }
    public String getJobUrl() { return jobUrl; }
    public String getDescription() { return description; }
    public ApplicationStatus getStatus() { return status; }
    public LocalDateTime getSavedAt() { return savedAt; }
    public LocalDateTime getAppliedAt() { return appliedAt; }
}
