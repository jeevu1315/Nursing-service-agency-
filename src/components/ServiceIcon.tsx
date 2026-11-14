import React from 'react';
import {
  HeartHandshake,
  ShieldPlus,
  Home,
  Hospital,
  Stethoscope,
  HeartPulse,
  UserCheck,
  Cross,
} from 'lucide-react';
import { ServiceIconKey } from '../types/agency';

interface ServiceIconProps {
  icon: ServiceIconKey;
  className?: string;
}

export const SERVICE_ICON_OPTIONS: { key: ServiceIconKey; label: string }[] = [
  { key: 'female-nurse', label: 'Female Nurse' },
  { key: 'male-nurse', label: 'Male Nurse' },
  { key: 'home-care', label: 'Home Care' },
  { key: 'hospital-care', label: 'Hospital Care' },
  { key: 'stethoscope', label: 'Stethoscope' },
  { key: 'heart-pulse', label: 'Vitals & Heart' },
  { key: 'shield-plus', label: 'Medical Shield' },
  { key: 'user-check', label: 'Verified Caregiver' },
];

export const ServiceIcon: React.FC<ServiceIconProps> = ({ icon, className = 'w-6 h-6' }) => {
  switch (icon) {
    case 'female-nurse':
      return <HeartHandshake className={className} aria-hidden="true" />;
    case 'male-nurse':
      return <ShieldPlus className={className} aria-hidden="true" />;
    case 'home-care':
      return <Home className={className} aria-hidden="true" />;
    case 'hospital-care':
      return <Hospital className={className} aria-hidden="true" />;
    case 'stethoscope':
      return <Stethoscope className={className} aria-hidden="true" />;
    case 'heart-pulse':
      return <HeartPulse className={className} aria-hidden="true" />;
    case 'user-check':
      return <UserCheck className={className} aria-hidden="true" />;
    default:
      return <Cross className={className} aria-hidden="true" />;
  }
};
