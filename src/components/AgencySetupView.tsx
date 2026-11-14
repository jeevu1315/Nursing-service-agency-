import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Upload,
  Trash2,
  Plus,
  Pencil,
  Check,
  X,
  Save,
  AlertCircle,
  CheckCircle2,
  RotateCcw,
  MapPin,
} from 'lucide-react';
import { AgencyData, NursingService, ServiceIconKey } from '../types/agency';
import {
  DEFAULT_AGENCY_DATA,
  resizeImageToDataUrl,
  validateEmail,
  validatePhone,
} from '../utils/storage';
import { CompanyLogo } from './CompanyLogo';
import { SERVICE_ICON_OPTIONS, ServiceIcon } from './ServiceIcon';

interface AgencySetupViewProps {
  agency: AgencyData;
  onSave: (updated: AgencyData) => { ok: boolean; error?: string };
  onUnsavedChange?: (hasUnsaved: boolean) => void;
}

interface FieldErrors {
  companyName?: string;
  tagline?: string;
  aboutCompany?: string;
  phoneNumber?: string;
  whatsappNumber?: string;
  emailAddress?: string;
  services?: Record<string, { title?: string; description?: string }>;
}

export const AgencySetupView: React.FC<AgencySetupViewProps> = ({
  agency,
  onSave,
  onUnsavedChange,
}) => {
  const [draft, setDraft] = useState<AgencyData>(agency);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [statusBanner, setStatusBanner] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // Logo upload state
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [logoError, setLogoError] = useState<string | null>(null);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);

  // Add city state
  const [newCity, setNewCity] = useState('');
  const [cityError, setCityError] = useState<string | null>(null);
  const [editingCityIndex, setEditingCityIndex] = useState<number | null>(null);
  const [editingCityValue, setEditingCityValue] = useState('');

  // Add service state
  const [showAddService, setShowAddService] = useState(false);
  const [newServiceTitle, setNewServiceTitle] = useState('');
  const [newServiceDesc, setNewServiceDesc] = useState('');
  const [newServiceIcon, setNewServiceIcon] = useState<ServiceIconKey>('stethoscope');
  const [newServiceError, setNewServiceError] = useState<string | null>(null);

  // Reset confirmation state
  const [confirmReset, setConfirmReset] = useState(false);

  useEffect(() => {
    setDraft(agency);
  }, [agency]);

  const hasUnsavedChanges = useMemo(() => {
    return (
      draft.companyName !== agency.companyName ||
      draft.tagline !== agency.tagline ||
      draft.aboutCompany !== agency.aboutCompany ||
      draft.logoDataUrl !== agency.logoDataUrl ||
      draft.phoneNumber !== agency.phoneNumber ||
      draft.whatsappNumber !== agency.whatsappNumber ||
      draft.emailAddress !== agency.emailAddress ||
      JSON.stringify(draft.services) !== JSON.stringify(agency.services) ||
      JSON.stringify(draft.locations) !== JSON.stringify(agency.locations)
    );
  }, [draft, agency]);

  useEffect(() => {
    onUnsavedChange?.(hasUnsavedChanges);
  }, [hasUnsavedChanges, onUnsavedChange]);

  const handleLogoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoError(null);
    setStatusBanner(null);
    setIsUploadingLogo(true);
    try {
      const dataUrl = await resizeImageToDataUrl(file, 256);
      setDraft((prev) => ({ ...prev, logoDataUrl: dataUrl }));
    } catch (err) {
      setLogoError(err instanceof Error ? err.message : 'Unable to process image file.');
    } finally {
      setIsUploadingLogo(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveLogo = () => {
    setLogoError(null);
    setStatusBanner(null);
    setDraft((prev) => ({ ...prev, logoDataUrl: null }));
  };

  // City management
  const handleAddCity = () => {
    const trimmed = newCity.trim();
    setCityError(null);
    if (!trimmed) {
      setCityError('Please enter a city name before adding.');
      return;
    }
    const exists = draft.locations.some(
      (city) => city.toLowerCase() === trimmed.toLowerCase()
    );
    if (exists) {
      setCityError(`"${trimmed}" is already in your service locations list.`);
      return;
    }
    setDraft((prev) => ({ ...prev, locations: [...prev.locations, trimmed] }));
    setNewCity('');
    setStatusBanner(null);
  };

  const startEditCity = (index: number) => {
    setEditingCityIndex(index);
    setEditingCityValue(draft.locations[index]);
    setCityError(null);
  };

  const saveEditCity = (index: number) => {
    const trimmed = editingCityValue.trim();
    if (!trimmed) {
      setCityError('City name cannot be empty.');
      return;
    }
    const duplicate = draft.locations.some(
      (city, idx) => idx !== index && city.toLowerCase() === trimmed.toLowerCase()
    );
    if (duplicate) {
      setCityError(`"${trimmed}" is already in your service locations list.`);
      return;
    }
    setDraft((prev) => ({
      ...prev,
      locations: prev.locations.map((c, idx) => (idx === index ? trimmed : c)),
    }));
    setEditingCityIndex(null);
    setEditingCityValue('');
    setCityError(null);
    setStatusBanner(null);
  };

  const cancelEditCity = () => {
    setEditingCityIndex(null);
    setEditingCityValue('');
    setCityError(null);
  };

  const handleDeleteCity = (index: number) => {
    if (editingCityIndex === index) {
      cancelEditCity();
    }
    setDraft((prev) => ({
      ...prev,
      locations: prev.locations.filter((_, idx) => idx !== index),
    }));
    setCityError(null);
    setStatusBanner(null);
  };

  // Service management
  const handleUpdateService = (
    id: string,
    field: keyof NursingService,
    value: string
  ) => {
    setDraft((prev) => ({
      ...prev,
      services: prev.services.map((s) => (s.id === id ? { ...s, [field]: value } : s)),
    }));
    setStatusBanner(null);
  };

  const handleDeleteService = (id: string) => {
    if (draft.services.length <= 1) {
      setStatusBanner({
        type: 'error',
        message: 'At least one nursing service must remain active.',
      });
      return;
    }
    setDraft((prev) => ({
      ...prev,
      services: prev.services.filter((s) => s.id !== id),
    }));
    setStatusBanner(null);
  };

  const handleAddService = () => {
    const title = newServiceTitle.trim();
    const description = newServiceDesc.trim();
    setNewServiceError(null);

    if (!title) {
      setNewServiceError('Service title is required.');
      return;
    }
    if (!description) {
      setNewServiceError('Service description is required.');
      return;
    }

    const newService: NursingService = {
      id: `service-${Date.now()}`,
      title,
      description,
      icon: newServiceIcon,
    };

    setDraft((prev) => ({
      ...prev,
      services: [...prev.services, newService],
    }));
    setNewServiceTitle('');
    setNewServiceDesc('');
    setNewServiceIcon('stethoscope');
    setShowAddService(false);
    setStatusBanner(null);
  };

  const validateAll = (): boolean => {
    const errors: FieldErrors = {};

    if (!draft.companyName.trim()) {
      errors.companyName = 'Company name is required.';
    }
    if (!draft.tagline.trim()) {
      errors.tagline = 'Tagline is required.';
    }
    if (!draft.aboutCompany.trim()) {
      errors.aboutCompany = 'About Our Company description is required.';
    }

    const phoneResult = validatePhone(draft.phoneNumber, 'Company phone number');
    if (!phoneResult.valid) {
      errors.phoneNumber = phoneResult.error;
    }

    const waResult = validatePhone(draft.whatsappNumber, 'WhatsApp number');
    if (!waResult.valid) {
      errors.whatsappNumber = waResult.error;
    }

    const emailResult = validateEmail(draft.emailAddress);
    if (!emailResult.valid) {
      errors.emailAddress = emailResult.error;
    }

    const serviceErrors: Record<string, { title?: string; description?: string }> = {};
    draft.services.forEach((service) => {
      const itemErr: { title?: string; description?: string } = {};
      if (!service.title.trim()) {
        itemErr.title = 'Service title is required.';
      }
      if (!service.description.trim()) {
        itemErr.description = 'Service description is required.';
      }
      if (itemErr.title || itemErr.description) {
        serviceErrors[service.id] = itemErr;
      }
    });
    if (Object.keys(serviceErrors).length > 0) {
      errors.services = serviceErrors;
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusBanner(null);

    if (!validateAll()) {
      setStatusBanner({
        type: 'error',
        message: 'Please fix the highlighted fields before saving changes.',
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const cleaned: AgencyData = {
      ...draft,
      companyName: draft.companyName.trim(),
      tagline: draft.tagline.trim(),
      aboutCompany: draft.aboutCompany.trim(),
      phoneNumber: draft.phoneNumber.trim(),
      whatsappNumber: draft.whatsappNumber.trim(),
      emailAddress: draft.emailAddress.trim(),
      services: draft.services.map((s) => ({
        ...s,
        title: s.title.trim(),
        description: s.description.trim(),
      })),
      locations: draft.locations.map((c) => c.trim()).filter(Boolean),
      updatedAt: new Date().toISOString(),
    };

    const result = onSave(cleaned);
    if (result.ok) {
      setDraft(cleaned);
      setFieldErrors({});
      setStatusBanner({
        type: 'success',
        message: 'Changes saved successfully. Your updates will remain after refreshing.',
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setStatusBanner({
        type: 'error',
        message: result.error ?? 'Could not save changes.',
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleResetDefaults = () => {
    const resetData: AgencyData = {
      ...DEFAULT_AGENCY_DATA,
      updatedAt: new Date().toISOString(),
    };
    const result = onSave(resetData);
    if (result.ok) {
      setDraft(resetData);
      setFieldErrors({});
      setConfirmReset(false);
      setStatusBanner({
        type: 'success',
        message: 'Agency profile reset to default values.',
      });
    } else {
      setStatusBanner({
        type: 'error',
        message: result.error ?? 'Unable to reset defaults.',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-8">
      <div className="rounded-3xl bg-[#E8F5E9] border border-[#72DDAA]/50 p-6 sm:p-8 shadow-xs">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#087443]">
          Agency Setup
        </h1>
        <p className="mt-1.5 text-sm sm:text-base text-[#11181C]">
          Customize your agency branding, nursing services, service cities, and direct contact details.
        </p>
      </div>

      {statusBanner && (
        <div
          role={statusBanner.type === 'error' ? 'alert' : 'status'}
          aria-live="polite"
          className={`rounded-2xl p-4 border flex items-start gap-3 ${
            statusBanner.type === 'success'
              ? 'bg-[#E8F5E9] border-[#087443] text-[#064E2E]'
              : 'bg-red-50 border-red-300 text-red-900'
          }`}
        >
          {statusBanner.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-[#087443] shrink-0 mt-0.5" aria-hidden="true" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" aria-hidden="true" />
          )}
          <div className="text-sm font-medium">{statusBanner.message}</div>
        </div>
      )}

      {hasUnsavedChanges && !statusBanner && (
        <div
          role="status"
          className="rounded-2xl bg-[#E8F5E9]/70 border border-[#72DDAA] px-4 py-3 text-sm font-medium text-[#064E2E]"
        >
          You have unsaved edits. Tap <strong>Save Changes</strong> below to publish and persist them.
        </div>
      )}

      {/* 1. Brand Identity & Company Logo */}
      <section
        aria-labelledby="setup-brand-heading"
        className="rounded-3xl bg-white border border-[#72DDAA]/45 p-6 sm:p-8 shadow-xs space-y-6"
      >
        <h2 id="setup-brand-heading" className="text-xl font-bold text-[#087443]">
          Company Logo &amp; Profile
        </h2>

        <div className="flex flex-col sm:flex-row sm:items-center gap-5 p-4 rounded-2xl bg-[#E8F5E9]/60 border border-[#72DDAA]/40">
          <CompanyLogo
            logoDataUrl={draft.logoDataUrl}
            companyName={draft.companyName || 'Agency'}
            size="lg"
          />

          <div className="space-y-2.5 flex-1">
            <div>
              <p className="text-sm font-bold text-[#087443]">Company Logo</p>
              <p className="text-xs text-[#2D4A3B]">
                Upload a PNG, JPG, WEBP, or SVG logo (automatically optimized for offline storage).
              </p>
            </div>

            <div className="flex flex-wrap gap-2.5">
              <input
                ref={fileInputRef}
                id="company-logo-upload"
                type="file"
                accept="image/*"
                onChange={(e) => void handleLogoFileChange(e)}
                className="sr-only"
              />
              <label
                htmlFor="company-logo-upload"
                className="inline-flex items-center justify-center gap-2 min-h-[44px] px-4 py-2 rounded-xl bg-[#087443] text-white text-sm font-semibold hover:bg-[#065E36] cursor-pointer transition-colors"
              >
                <Upload className="w-4 h-4" aria-hidden="true" />
                <span>{isUploadingLogo ? 'Processing...' : 'Upload Logo'}</span>
              </label>

              {draft.logoDataUrl && (
                <button
                  type="button"
                  onClick={handleRemoveLogo}
                  className="inline-flex items-center justify-center gap-2 min-h-[44px] px-4 py-2 rounded-xl bg-white text-red-700 border border-red-200 text-sm font-semibold hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" aria-hidden="true" />
                  <span>Remove Logo</span>
                </button>
              )}
            </div>

            {logoError && (
              <p role="alert" className="text-xs font-medium text-red-700">
                {logoError}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label
              htmlFor="company-name-input"
              className="block text-sm font-semibold text-[#087443] mb-1.5"
            >
              Company Name <span className="text-red-600">*</span>
            </label>
            <input
              id="company-name-input"
              type="text"
              value={draft.companyName}
              onChange={(e) => {
                setDraft((prev) => ({ ...prev, companyName: e.target.value }));
                setFieldErrors((prev) => ({ ...prev, companyName: undefined }));
                setStatusBanner(null);
              }}
              placeholder="Nursing Service Agency"
              className={`w-full min-h-[44px] rounded-xl px-4 py-2.5 text-sm text-[#11181C] bg-white border focus:outline-2 focus:outline-[#087443] ${
                fieldErrors.companyName ? 'border-red-500' : 'border-[#72DDAA]/70'
              }`}
            />
            {fieldErrors.companyName && (
              <p className="mt-1 text-xs font-medium text-red-700">{fieldErrors.companyName}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="tagline-input"
              className="block text-sm font-semibold text-[#087443] mb-1.5"
            >
              Tagline <span className="text-red-600">*</span>
            </label>
            <input
              id="tagline-input"
              type="text"
              value={draft.tagline}
              onChange={(e) => {
                setDraft((prev) => ({ ...prev, tagline: e.target.value }));
                setFieldErrors((prev) => ({ ...prev, tagline: undefined }));
                setStatusBanner(null);
              }}
              placeholder="Professional Care, Compassionate Service"
              className={`w-full min-h-[44px] rounded-xl px-4 py-2.5 text-sm text-[#11181C] bg-white border focus:outline-2 focus:outline-[#087443] ${
                fieldErrors.tagline ? 'border-red-500' : 'border-[#72DDAA]/70'
              }`}
            />
            {fieldErrors.tagline && (
              <p className="mt-1 text-xs font-medium text-red-700">{fieldErrors.tagline}</p>
            )}
          </div>
        </div>

        <div>
          <label
            htmlFor="about-company-input"
            className="block text-sm font-semibold text-[#087443] mb-1.5"
          >
            About Our Company <span className="text-red-600">*</span>
          </label>
          <textarea
            id="about-company-input"
            rows={4}
            value={draft.aboutCompany}
            onChange={(e) => {
              setDraft((prev) => ({ ...prev, aboutCompany: e.target.value }));
              setFieldErrors((prev) => ({ ...prev, aboutCompany: undefined }));
              setStatusBanner(null);
            }}
            placeholder="Describe your nursing agency's experience, values, and care standards..."
            className={`w-full rounded-xl px-4 py-3 text-sm text-[#11181C] bg-white border focus:outline-2 focus:outline-[#087443] ${
              fieldErrors.aboutCompany ? 'border-red-500' : 'border-[#72DDAA]/70'
            }`}
          />
          {fieldErrors.aboutCompany && (
            <p className="mt-1 text-xs font-medium text-red-700">{fieldErrors.aboutCompany}</p>
          )}
        </div>
      </section>

      {/* 2. Contact Details */}
      <section
        aria-labelledby="setup-contact-heading"
        className="rounded-3xl bg-white border border-[#72DDAA]/45 p-6 sm:p-8 shadow-xs space-y-5"
      >
        <div>
          <h2 id="setup-contact-heading" className="text-xl font-bold text-[#087443]">
            Contact Details
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-[#2D4A3B]">
            Include country code for international WhatsApp compatibility (e.g., +1 555 019 2834).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label
              htmlFor="phone-input"
              className="block text-sm font-semibold text-[#087443] mb-1.5"
            >
              Company Phone Number <span className="text-red-600">*</span>
            </label>
            <input
              id="phone-input"
              type="tel"
              value={draft.phoneNumber}
              onChange={(e) => {
                setDraft((prev) => ({ ...prev, phoneNumber: e.target.value }));
                setFieldErrors((prev) => ({ ...prev, phoneNumber: undefined }));
                setStatusBanner(null);
              }}
              placeholder="+1 555 019 2834"
              className={`w-full min-h-[44px] rounded-xl px-4 py-2.5 text-sm text-[#11181C] bg-white border focus:outline-2 focus:outline-[#087443] ${
                fieldErrors.phoneNumber ? 'border-red-500' : 'border-[#72DDAA]/70'
              }`}
            />
            {fieldErrors.phoneNumber && (
              <p className="mt-1 text-xs font-medium text-red-700">{fieldErrors.phoneNumber}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="whatsapp-input"
              className="block text-sm font-semibold text-[#087443] mb-1.5"
            >
              WhatsApp Number <span className="text-red-600">*</span>
            </label>
            <input
              id="whatsapp-input"
              type="tel"
              value={draft.whatsappNumber}
              onChange={(e) => {
                setDraft((prev) => ({ ...prev, whatsappNumber: e.target.value }));
                setFieldErrors((prev) => ({ ...prev, whatsappNumber: undefined }));
                setStatusBanner(null);
              }}
              placeholder="+1 555 019 2834"
              className={`w-full min-h-[44px] rounded-xl px-4 py-2.5 text-sm text-[#11181C] bg-white border focus:outline-2 focus:outline-[#087443] ${
                fieldErrors.whatsappNumber ? 'border-red-500' : 'border-[#72DDAA]/70'
              }`}
            />
            {fieldErrors.whatsappNumber && (
              <p className="mt-1 text-xs font-medium text-red-700">{fieldErrors.whatsappNumber}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="email-input"
              className="block text-sm font-semibold text-[#087443] mb-1.5"
            >
              Email Address <span className="text-red-600">*</span>
            </label>
            <input
              id="email-input"
              type="email"
              value={draft.emailAddress}
              onChange={(e) => {
                setDraft((prev) => ({ ...prev, emailAddress: e.target.value }));
                setFieldErrors((prev) => ({ ...prev, emailAddress: undefined }));
                setStatusBanner(null);
              }}
              placeholder="care@nursingserviceagency.com"
              className={`w-full min-h-[44px] rounded-xl px-4 py-2.5 text-sm text-[#11181C] bg-white border focus:outline-2 focus:outline-[#087443] ${
                fieldErrors.emailAddress ? 'border-red-500' : 'border-[#72DDAA]/70'
              }`}
            />
            {fieldErrors.emailAddress && (
              <p className="mt-1 text-xs font-medium text-red-700">{fieldErrors.emailAddress}</p>
            )}
          </div>
        </div>
      </section>

      {/* 3. Manage Service Locations */}
      <section
        aria-labelledby="setup-locations-heading"
        className="rounded-3xl bg-white border border-[#72DDAA]/45 p-6 sm:p-8 shadow-xs space-y-5"
      >
        <div>
          <h2 id="setup-locations-heading" className="text-xl font-bold text-[#087443]">
            Manage Service Locations
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-[#2D4A3B]">
            Add, edit, or delete the cities where your agency provides nursing services.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <label htmlFor="add-city-input" className="sr-only">
              City name
            </label>
            <input
              id="add-city-input"
              type="text"
              value={newCity}
              onChange={(e) => {
                setNewCity(e.target.value);
                setCityError(null);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddCity();
                }
              }}
              placeholder="Enter city name"
              className="w-full min-h-[44px] rounded-xl px-4 py-2.5 text-sm text-[#11181C] bg-white border border-[#72DDAA]/70 focus:outline-2 focus:outline-[#087443]"
            />
          </div>
          <button
            type="button"
            onClick={handleAddCity}
            className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2.5 rounded-xl bg-[#087443] text-white text-sm font-semibold hover:bg-[#065E36] transition-colors whitespace-nowrap shrink-0"
          >
            <Plus className="w-4 h-4" aria-hidden="true" />
            <span>Add City</span>
          </button>
        </div>

        {cityError && (
          <p role="alert" className="text-xs font-medium text-red-700">
            {cityError}
          </p>
        )}

        {draft.locations.length === 0 ? (
          <div className="rounded-2xl bg-[#E8F5E9]/60 border border-[#72DDAA]/40 p-4 text-sm text-[#2D4A3B] flex items-center gap-3">
            <MapPin className="w-4 h-4 text-[#087443] shrink-0" aria-hidden="true" />
            <span>No cities added yet. Enter a city name above and click Add City.</span>
          </div>
        ) : (
          <ul className="space-y-2.5">
            {draft.locations.map((city, index) => (
              <li
                key={`${city}-${index}`}
                className="rounded-2xl bg-[#E8F5E9] border border-[#72DDAA]/40 px-4 py-2.5 flex items-center justify-between gap-3"
              >
                {editingCityIndex === index ? (
                  <div className="flex-1 flex flex-wrap sm:flex-nowrap items-center gap-2">
                    <input
                      type="text"
                      aria-label={`Edit city ${city}`}
                      value={editingCityValue}
                      onChange={(e) => setEditingCityValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          saveEditCity(index);
                        } else if (e.key === 'Escape') {
                          cancelEditCity();
                        }
                      }}
                      className="flex-1 min-w-[160px] min-h-[40px] rounded-xl px-3 py-1.5 text-sm bg-white border border-[#087443] text-[#11181C] focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => saveEditCity(index)}
                      aria-label="Confirm city update"
                      className="inline-flex items-center justify-center min-h-[44px] min-w-[44px] rounded-xl bg-[#087443] text-white hover:bg-[#065E36] transition-colors"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={cancelEditCity}
                      aria-label="Cancel city edit"
                      className="inline-flex items-center justify-center min-h-[44px] min-w-[44px] rounded-xl bg-white text-[#11181C] border border-[#72DDAA] hover:bg-[#f4fbf5] transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-2.5 min-w-0">
                      <MapPin className="w-4 h-4 text-[#087443] shrink-0" aria-hidden="true" />
                      <span className="text-sm font-semibold text-[#064E2E] truncate">
                        {city}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => startEditCity(index)}
                        aria-label={`Edit ${city}`}
                        className="inline-flex items-center justify-center min-h-[44px] min-w-[44px] rounded-xl bg-white text-[#087443] border border-[#72DDAA]/60 hover:bg-[#f4fbf5] transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteCity(index)}
                        aria-label={`Delete ${city}`}
                        className="inline-flex items-center justify-center min-h-[44px] min-w-[44px] rounded-xl bg-white text-red-700 border border-red-200 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* 4. Manage Services */}
      <section
        aria-labelledby="setup-services-heading"
        className="rounded-3xl bg-white border border-[#72DDAA]/45 p-6 sm:p-8 shadow-xs space-y-5"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 id="setup-services-heading" className="text-xl font-bold text-[#087443]">
              Manage Services
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-[#2D4A3B]">
              Customize service titles, medical icons, and descriptions shown to families.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setShowAddService((prev) => !prev);
              setNewServiceError(null);
            }}
            className="inline-flex items-center justify-center gap-2 min-h-[44px] px-4 py-2 rounded-xl bg-[#E8F5E9] text-[#087443] border border-[#72DDAA] text-sm font-semibold hover:bg-[#d7eed9] transition-colors whitespace-nowrap shrink-0"
          >
            <Plus className="w-4 h-4" aria-hidden="true" />
            <span>{showAddService ? 'Close Form' : 'Add Service'}</span>
          </button>
        </div>

        {showAddService && (
          <div className="rounded-2xl bg-[#E8F5E9] border border-[#72DDAA] p-5 space-y-4">
            <h3 className="text-base font-bold text-[#087443]">New Nursing Service</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="new-service-title"
                  className="block text-xs font-semibold text-[#087443] mb-1"
                >
                  Service Title <span className="text-red-600">*</span>
                </label>
                <input
                  id="new-service-title"
                  type="text"
                  value={newServiceTitle}
                  onChange={(e) => {
                    setNewServiceTitle(e.target.value);
                    setNewServiceError(null);
                  }}
                  placeholder="e.g., Post-Operative Care"
                  className="w-full min-h-[44px] rounded-xl px-3.5 py-2 text-sm bg-white border border-[#72DDAA] text-[#11181C] focus:outline-2 focus:outline-[#087443]"
                />
              </div>

              <div>
                <label
                  htmlFor="new-service-icon"
                  className="block text-xs font-semibold text-[#087443] mb-1"
                >
                  Medical Icon
                </label>
                <select
                  id="new-service-icon"
                  value={newServiceIcon}
                  onChange={(e) => setNewServiceIcon(e.target.value as ServiceIconKey)}
                  className="w-full min-h-[44px] rounded-xl px-3.5 py-2 text-sm bg-white border border-[#72DDAA] text-[#11181C] focus:outline-2 focus:outline-[#087443]"
                >
                  {SERVICE_ICON_OPTIONS.map((opt) => (
                    <option key={opt.key} value={opt.key}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="new-service-desc"
                className="block text-xs font-semibold text-[#087443] mb-1"
              >
                Short Description <span className="text-red-600">*</span>
              </label>
              <textarea
                id="new-service-desc"
                rows={2}
                value={newServiceDesc}
                onChange={(e) => {
                  setNewServiceDesc(e.target.value);
                  setNewServiceError(null);
                }}
                placeholder="Describe what this service includes..."
                className="w-full rounded-xl px-3.5 py-2 text-sm bg-white border border-[#72DDAA] text-[#11181C] focus:outline-2 focus:outline-[#087443]"
              />
            </div>

            {newServiceError && (
              <p role="alert" className="text-xs font-medium text-red-700">
                {newServiceError}
              </p>
            )}

            <div className="flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setShowAddService(false)}
                className="min-h-[44px] px-4 py-2 rounded-xl bg-white text-[#11181C] border border-[#72DDAA] text-sm font-semibold hover:bg-[#f4fbf5]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddService}
                className="min-h-[44px] px-5 py-2 rounded-xl bg-[#087443] text-white text-sm font-semibold hover:bg-[#065E36]"
              >
                Add to List
              </button>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {draft.services.map((service) => {
            const err = fieldErrors.services?.[service.id];
            return (
              <div
                key={service.id}
                className="rounded-2xl bg-[#E8F5E9]/70 border border-[#72DDAA]/45 p-4 sm:p-5 space-y-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#087443] text-white flex items-center justify-center shrink-0">
                      <ServiceIcon icon={service.icon} className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-bold text-[#087443]">
                      {service.title || 'Untitled Service'}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteService(service.id)}
                    aria-label={`Delete ${service.title || 'service'}`}
                    className="inline-flex items-center justify-center gap-1.5 min-h-[44px] px-3 py-2 rounded-xl bg-white text-red-700 border border-red-200 text-xs font-semibold hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" aria-hidden="true" />
                    <span>Remove</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor={`service-title-${service.id}`}
                      className="block text-xs font-semibold text-[#087443] mb-1"
                    >
                      Service Title <span className="text-red-600">*</span>
                    </label>
                    <input
                      id={`service-title-${service.id}`}
                      type="text"
                      value={service.title}
                      onChange={(e) => {
                        handleUpdateService(service.id, 'title', e.target.value);
                        setFieldErrors((prev) => {
                          if (!prev.services?.[service.id]) return prev;
                          const nextServices = { ...prev.services };
                          delete nextServices[service.id];
                          return { ...prev, services: nextServices };
                        });
                      }}
                      className={`w-full min-h-[44px] rounded-xl px-3.5 py-2 text-sm bg-white border text-[#11181C] focus:outline-2 focus:outline-[#087443] ${
                        err?.title ? 'border-red-500' : 'border-[#72DDAA]/70'
                      }`}
                    />
                    {err?.title && (
                      <p className="mt-1 text-xs font-medium text-red-700">{err.title}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor={`service-icon-${service.id}`}
                      className="block text-xs font-semibold text-[#087443] mb-1"
                    >
                      Medical Icon
                    </label>
                    <select
                      id={`service-icon-${service.id}`}
                      value={service.icon}
                      onChange={(e) =>
                        handleUpdateService(service.id, 'icon', e.target.value)
                      }
                      className="w-full min-h-[44px] rounded-xl px-3.5 py-2 text-sm bg-white border border-[#72DDAA]/70 text-[#11181C] focus:outline-2 focus:outline-[#087443]"
                    >
                      {SERVICE_ICON_OPTIONS.map((opt) => (
                        <option key={opt.key} value={opt.key}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor={`service-desc-${service.id}`}
                    className="block text-xs font-semibold text-[#087443] mb-1"
                  >
                    Description <span className="text-red-600">*</span>
                  </label>
                  <textarea
                    id={`service-desc-${service.id}`}
                    rows={2}
                    value={service.description}
                    onChange={(e) => {
                      handleUpdateService(service.id, 'description', e.target.value);
                      setFieldErrors((prev) => {
                        if (!prev.services?.[service.id]) return prev;
                        const nextServices = { ...prev.services };
                        delete nextServices[service.id];
                        return { ...prev, services: nextServices };
                      });
                    }}
                    className={`w-full rounded-xl px-3.5 py-2 text-sm bg-white border text-[#11181C] focus:outline-2 focus:outline-[#087443] ${
                      err?.description ? 'border-red-500' : 'border-[#72DDAA]/70'
                    }`}
                  />
                  {err?.description && (
                    <p className="mt-1 text-xs font-medium text-red-700">{err.description}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Save Changes & Reset Actions */}
      <div className="rounded-3xl bg-[#E8F5E9] border border-[#72DDAA]/50 p-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div>
          {!confirmReset ? (
            <button
              type="button"
              onClick={() => setConfirmReset(true)}
              className="inline-flex items-center justify-center gap-2 min-h-[44px] px-4 py-2 rounded-xl bg-white text-[#2D4A3B] border border-[#72DDAA] text-sm font-semibold hover:bg-[#f4fbf5] transition-colors"
            >
              <RotateCcw className="w-4 h-4" aria-hidden="true" />
              <span>Reset Defaults</span>
            </button>
          ) : (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-[#064E2E]">
                Restore default profile?
              </span>
              <button
                type="button"
                onClick={handleResetDefaults}
                className="min-h-[44px] px-3.5 py-2 rounded-xl bg-red-600 text-white text-xs font-semibold hover:bg-red-700"
              >
                Confirm Reset
              </button>
              <button
                type="button"
                onClick={() => setConfirmReset(false)}
                className="min-h-[44px] px-3.5 py-2 rounded-xl bg-white text-[#11181C] border border-[#72DDAA] text-xs font-semibold"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2.5 min-h-[48px] px-8 py-3 rounded-2xl bg-[#087443] text-white font-semibold text-base shadow-sm hover:bg-[#065E36] active:scale-[0.99] transition-all whitespace-nowrap"
        >
          <Save className="w-5 h-5 shrink-0" aria-hidden="true" />
          <span>Save Changes</span>
        </button>
      </div>
    </form>
  );
};
