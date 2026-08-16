export type ApplicationStatus = 'SAVED' | 'APPLIED' | 'REJECTED' | 'INTERVIEW' | 'OFFER';

export interface JobApplication {
  id: number;
  jobTitle: string;
  companyName: string;
  location: string | null;
  jobUrl: string;
  description: string | null;
  status: ApplicationStatus;
  savedAt: string;
  appliedAt: string | null;
}
