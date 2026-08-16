import { DatePipe } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { finalize } from 'rxjs';

import { ApplicationStatus, JobApplication } from './job-application.model';
import { JobApplicationService } from './job-application.service';

@Component({
  selector: 'app-root',
  imports: [DatePipe],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  private readonly jobService = inject(JobApplicationService);

  protected readonly jobs = signal<JobApplication[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal('');
  protected readonly selectedCompany = signal('');
  protected readonly selectedLocation = signal('');
  protected readonly selectedStatus = signal('');
  protected readonly updatingJobIds = signal<ReadonlySet<number>>(new Set());
  protected readonly statusUpdateErrors = signal<Readonly<Record<number, string>>>({});

  protected readonly statuses: ReadonlyArray<{ value: ApplicationStatus; label: string }> = [
    { value: 'SAVED', label: 'Saved' },
    { value: 'APPLIED', label: 'Applied' },
    { value: 'REJECTED', label: 'Rejected' },
    { value: 'INTERVIEW', label: 'Interview' },
    { value: 'OFFER', label: 'Offer' },
  ];

  protected readonly companies = computed(() =>
    [...new Set(this.jobs().map((job) => job.companyName).filter(Boolean))].sort((a, b) => a.localeCompare(b)),
  );

  protected readonly locations = computed(() =>
    [...new Set(this.jobs().map((job) => job.location).filter((location): location is string => Boolean(location)))]
      .sort((a, b) => a.localeCompare(b)),
  );

  protected readonly filteredJobs = computed(() => {
    const company = this.selectedCompany();
    const location = this.selectedLocation();
    const status = this.selectedStatus();

    return this.jobs().filter((job) =>
      (!company || job.companyName === company)
      && (!location || job.location === location)
      && (!status || job.status === status),
    );
  });

  protected readonly hasActiveFilters = computed(() => Boolean(
    this.selectedCompany() || this.selectedLocation() || this.selectedStatus(),
  ));

  ngOnInit(): void {
    this.jobService
      .getJobs()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (jobs) => this.jobs.set(jobs),
        error: () => this.error.set('Unable to load jobs. Make sure the backend is running on localhost:8080.'),
      });
  }

  protected clearFilters(): void {
    this.selectedCompany.set('');
    this.selectedLocation.set('');
    this.selectedStatus.set('');
  }

  protected statusLabel(status: ApplicationStatus): string {
    return this.statuses.find((option) => option.value === status)?.label ?? status;
  }

  protected updateJobStatus(job: JobApplication, status: string, select: HTMLSelectElement): void {
    const newStatus = status as ApplicationStatus;
    const previousStatus = job.status;

    if (newStatus === previousStatus) {
      return;
    }

    this.setJobUpdating(job.id, true);
    this.setStatusError(job.id, '');

    this.jobService
      .updateStatus(job.id, newStatus)
      .pipe(finalize(() => this.setJobUpdating(job.id, false)))
      .subscribe({
        next: (updatedJob) => {
          this.jobs.update((jobs) => jobs.map((current) => current.id === updatedJob.id ? updatedJob : current));
        },
        error: () => {
          select.value = previousStatus;
          this.setStatusError(job.id, 'Status could not be updated. Please try again.');
        },
      });
  }

  private setJobUpdating(id: number, updating: boolean): void {
    this.updatingJobIds.update((current) => {
      const next = new Set(current);
      if (updating) {
        next.add(id);
      } else {
        next.delete(id);
      }
      return next;
    });
  }

  private setStatusError(id: number, message: string): void {
    this.statusUpdateErrors.update((current) => ({ ...current, [id]: message }));
  }
}
