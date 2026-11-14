import { AgencyData } from '../types/agency';

export const STORAGE_KEY = 'nursing_service_agency_data_v1';

export const DEFAULT_AGENCY_DATA: AgencyData = {
  companyName: 'Nursing Service Agency',
  tagline: 'Professional Care, Compassionate Service',
  aboutCompany:
    'We provide qualified, dependable nursing professionals for families and healthcare facilities. From attentive female and male bedside nurses to structured home recovery and hospital support, our team delivers respectful clinical care tailored to every patient.',
  logoDataUrl: null,
  services: [
    {
      id: 'female-nurse',
      title: 'Female Nurse',
      description:
        'Experienced female nurses offering attentive personal assistance, medication reminders, vitals tracking, and compassionate bedside care.',
      icon: 'female-nurse',
    },
    {
      id: 'male-nurse',
      title: 'Male Nurse',
      description:
        'Trained male nurses specializing in safe patient mobility, post-surgical recovery support, rehabilitation assistance, and clinical monitoring.',
      icon: 'male-nurse',
    },
    {
      id: 'home-nursing-care',
      title: 'Home Nursing Care',
      description:
        'Dedicated nursing care in the comfort of home, covering wound dressing, chronic care routines, senior support, and daily health observation.',
      icon: 'home-care',
    },
    {
      id: 'hospital-nursing-care',
      title: 'Hospital Nursing Care',
      description:
        'Reliable one-on-one bedside nursing support inside hospitals for post-operative recovery, overnight patient supervision, and family relief.',
      icon: 'hospital-care',
    },
  ],
  // Intentionally empty by default: administrator adds actual city names in Agency Setup.
  locations: [],
  phoneNumber: '+1 555 019 2834',
  whatsappNumber: '+1 555 019 2834',
  emailAddress: 'care@nursingserviceagency.com',
  updatedAt: new Date().toISOString(),
};

export function loadAgencyData(): AgencyData {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return DEFAULT_AGENCY_DATA;
    }
    const parsed = JSON.parse(raw) as Partial<AgencyData>;
    return {
      companyName:
        typeof parsed.companyName === 'string' && parsed.companyName.trim().length > 0
          ? parsed.companyName
          : DEFAULT_AGENCY_DATA.companyName,
      tagline:
        typeof parsed.tagline === 'string' && parsed.tagline.trim().length > 0
          ? parsed.tagline
          : DEFAULT_AGENCY_DATA.tagline,
      aboutCompany:
        typeof parsed.aboutCompany === 'string' && parsed.aboutCompany.trim().length > 0
          ? parsed.aboutCompany
          : DEFAULT_AGENCY_DATA.aboutCompany,
      logoDataUrl: typeof parsed.logoDataUrl === 'string' ? parsed.logoDataUrl : null,
      services:
        Array.isArray(parsed.services) && parsed.services.length > 0
          ? parsed.services
          : DEFAULT_AGENCY_DATA.services,
      locations: Array.isArray(parsed.locations)
        ? parsed.locations.filter((c): c is string => typeof c === 'string' && c.trim().length > 0)
        : [],
      phoneNumber:
        typeof parsed.phoneNumber === 'string' && parsed.phoneNumber.trim().length > 0
          ? parsed.phoneNumber
          : DEFAULT_AGENCY_DATA.phoneNumber,
      whatsappNumber:
        typeof parsed.whatsappNumber === 'string' && parsed.whatsappNumber.trim().length > 0
          ? parsed.whatsappNumber
          : DEFAULT_AGENCY_DATA.whatsappNumber,
      emailAddress:
        typeof parsed.emailAddress === 'string' && parsed.emailAddress.trim().length > 0
          ? parsed.emailAddress
          : DEFAULT_AGENCY_DATA.emailAddress,
      updatedAt:
        typeof parsed.updatedAt === 'string' ? parsed.updatedAt : DEFAULT_AGENCY_DATA.updatedAt,
    };
  } catch {
    return DEFAULT_AGENCY_DATA;
  }
}

export function saveAgencyData(data: AgencyData): { ok: boolean; error?: string } {
  try {
    const payload: AgencyData = {
      ...data,
      updatedAt: new Date().toISOString(),
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    return { ok: true };
  } catch (err) {
    if (err instanceof DOMException && err.name === 'QuotaExceededError') {
      return {
        ok: false,
        error: 'Storage limit reached. Try uploading a smaller company logo image.',
      };
    }
    return {
      ok: false,
      error: 'Unable to save data to browser storage. Please check browser privacy settings.',
    };
  }
}

export function validatePhone(value: string, label = 'Phone number'): {
  valid: boolean;
  error?: string;
  digits: string;
} {
  const trimmed = value.trim();
  if (!trimmed) {
    return { valid: false, error: `${label} is required.`, digits: '' };
  }
  if (!/^[+\d\s().-]+$/.test(trimmed)) {
    return {
      valid: false,
      error: `${label} can only contain digits, +, spaces, hyphens, and parentheses.`,
      digits: '',
    };
  }
  const digits = trimmed.replace(/\D/g, '');
  if (digits.length < 7 || digits.length > 15) {
    return {
      valid: false,
      error: `${label} must contain between 7 and 15 digits.`,
      digits,
    };
  }
  return { valid: true, digits };
}

export function validateEmail(value: string): { valid: boolean; error?: string } {
  const trimmed = value.trim();
  if (!trimmed) {
    return { valid: false, error: 'Email address is required.' };
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(trimmed)) {
    return { valid: false, error: 'Please enter a valid email address (e.g., care@agency.com).' };
  }
  return { valid: true };
}

export function formatTelHref(phone: string): string {
  const trimmed = phone.trim();
  const hasPlus = trimmed.startsWith('+');
  const digits = trimmed.replace(/\D/g, '');
  if (!digits) return '#';
  return `tel:${hasPlus ? '+' : ''}${digits}`;
}

export function formatWhatsAppHref(whatsapp: string, companyName: string): string {
  const digits = whatsapp.replace(/\D/g, '');
  if (!digits) return '#';
  const message = encodeURIComponent(
    `Hello ${companyName}, I would like to inquire about your nursing care services.`
  );
  return `https://wa.me/${digits}?text=${message}`;
}

export function resizeImageToDataUrl(file: File, maxSize = 256): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('Please select a valid image file (PNG, JPG, WEBP, or SVG).'));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      reject(new Error('Image file must be smaller than 5 MB.'));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read the selected image file.'));
    reader.onload = () => {
      const result = reader.result as string;
      if (file.type === 'image/svg+xml') {
        resolve(result);
        return;
      }

      const img = new Image();
      img.onerror = () => reject(new Error('Could not decode the selected image.'));
      img.onload = () => {
        const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
        const width = Math.max(1, Math.round(img.width * scale));
        const height = Math.max(1, Math.round(img.height * scale));
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(result);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/png', 0.9));
      };
      img.src = result;
    };
    reader.readAsDataURL(file);
  });
}
