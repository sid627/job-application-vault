# Job Application Vault

Job Application Vault is a job application management system. Its first phase will provide a minimal end-to-end flow for capturing job postings in a Chrome extension, saving them through a backend API, and viewing them in a dashboard.

## Intended architecture

```text
Chrome Extension → Spring Boot REST API → MySQL → Dashboard
```

## Technology choices

- **Backend:** Java with Spring Boot
- **Database:** MySQL
- **Browser extension:** Chrome Extension using Manifest V3
- **Dashboard:** Angular

## Repository structure

```text
job-application-vault/
├── backend/    # Spring Boot REST API
├── extension/  # Chrome Extension (Manifest V3)
├── dashboard/  # Angular dashboard
└── README.md
```

Phase 1 intentionally excludes authentication, AI, Kafka, Docker, notifications, and other nonessential functionality.
