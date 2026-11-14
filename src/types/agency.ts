export type ServiceIconKey =
  | 'female-nurse'
  | 'male-nurse'
  | 'home-care'
  | 'hospital-care'
  | 'stethoscope'
  | 'heart-pulse'
  | 'shield-plus'
  | 'user-check';

export interface NursingService {
  id: string;
  title: string;
  description: string;
  icon: ServiceIconKey;
}

export interface AgencyData {
  companyName: string;
  tagline: string;
  aboutCompany: string;
  logoDataUrl: string | null;
  services: NursingService[];
  locations: string[];
  phoneNumber: string;
  whatsappNumber: string;
  emailAddress: string;
  updatedAt: string;
}

export type TabId = 'home' | 'services' | 'setup';
