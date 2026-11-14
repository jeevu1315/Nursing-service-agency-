import React, { useState } from 'react';
import {
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  ArrowRight,
  HeartHandshake,
  ShieldCheck,
} from 'lucide-react';
import { AgencyData, TabId } from '../types/agency';
import { formatTelHref, formatWhatsAppHref } from '../utils/storage';
import { CompanyLogo } from './CompanyLogo';
import { ServiceIcon } from './ServiceIcon';
import heroIllustration from '../assets/images/nursing_hero_care_1794645929283.jpg';

interface HomeViewProps {
  agency: AgencyData;
  onNavigate: (tab: TabId) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ agency, onNavigate }) => {
  const [heroImgFailed, setHeroImgFailed] = useState(false);

  const telHref = formatTelHref(agency.phoneNumber);
  const whatsappHref = formatWhatsAppHref(agency.whatsappNumber, agency.companyName);

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section
        aria-labelledby="agency-hero-title"
        className="rounded-3xl bg-[#E8F5E9] border border-[#72DDAA]/50 p-6 sm:p-8 shadow-xs"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          <div className="lg:col-span-7 space-y-5">
            <div className="flex items-center gap-4">
              <CompanyLogo
                logoDataUrl={agency.logoDataUrl}
                companyName={agency.companyName}
                size="lg"
              />
              <div className="min-w-0">
                <h1
                  id="agency-hero-title"
                  className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#087443] text-balance"
                >
                  {agency.companyName}
                </h1>
                <p className="mt-1 text-base sm:text-lg font-medium text-[#11181C]">
                  {agency.tagline}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <a
                href={telHref}
                className="inline-flex items-center justify-center gap-2.5 min-h-[48px] px-6 py-3 rounded-2xl bg-[#087443] text-white font-semibold text-base shadow-sm hover:bg-[#065E36] active:scale-[0.99] transition-all whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#087443]"
              >
                <Phone className="w-5 h-5 shrink-0" aria-hidden="true" />
                <span>CALL NOW</span>
              </a>

              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 min-h-[48px] px-6 py-3 rounded-2xl bg-white text-[#087443] border border-[#72DDAA] font-semibold text-base hover:bg-[#f4fbf5] active:scale-[0.99] transition-all whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#087443]"
              >
                <MessageCircle className="w-5 h-5 shrink-0" aria-hidden="true" />
                <span>WhatsApp</span>
              </a>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs sm:text-sm text-[#064E2E] font-medium">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#087443]" aria-hidden="true" />
                Home &amp; Hospital Nursing Support
              </span>
              <span aria-hidden="true">·</span>
              <span>{agency.phoneNumber}</span>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-2xl overflow-hidden bg-white border border-[#72DDAA]/40 shadow-xs aspect-[4/3] flex items-center justify-center">
              {!heroImgFailed ? (
                <img
                  src={heroIllustration}
                  alt="Compassionate female and male nurses supporting a patient at home"
                  referrerPolicy="no-referrer"
                  onError={() => setHeroImgFailed(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="p-6 flex flex-col items-center justify-center text-center gap-3 bg-[#E8F5E9]/40 w-full h-full">
                  <div className="w-14 h-14 rounded-2xl bg-[#087443] text-white flex items-center justify-center">
                    <HeartHandshake className="w-7 h-7" aria-hidden="true" />
                  </div>
                  <p className="text-sm font-semibold text-[#087443]">
                    {agency.companyName}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* About Our Company */}
      <section
        aria-labelledby="about-company-heading"
        className="rounded-3xl bg-white border border-[#E8F5E9] shadow-xs p-6 sm:p-8"
      >
        <div className="max-w-3xl">
          <h2
            id="about-company-heading"
            className="text-xl sm:text-2xl font-bold text-[#087443]"
          >
            About Our Company
          </h2>
          <p className="mt-3 text-base leading-relaxed text-[#11181C] whitespace-pre-line">
            {agency.aboutCompany}
          </p>
        </div>
      </section>

      {/* Our Services */}
      <section aria-labelledby="home-services-heading" className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h2
            id="home-services-heading"
            className="text-xl sm:text-2xl font-bold text-[#087443]"
          >
            Our Services
          </h2>
          <button
            type="button"
            onClick={() => onNavigate('services')}
            className="inline-flex items-center gap-1.5 min-h-[44px] px-3 py-2 rounded-xl text-sm font-semibold text-[#087443] hover:bg-[#E8F5E9] transition-colors whitespace-nowrap shrink-0"
          >
            <span>View All Services</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {agency.services.map((service) => (
            <article
              key={service.id}
              className="rounded-2xl bg-[#E8F5E9] border border-[#72DDAA]/40 p-5 shadow-xs flex flex-col justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white text-[#087443] border border-[#72DDAA]/50 flex items-center justify-center shrink-0 shadow-2xs">
                  <ServiceIcon icon={service.icon} className="w-6 h-6" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-lg font-bold text-[#087443]">
                    {service.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-[#11181C]">
                    {service.description}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Service Locations */}
      <section
        aria-labelledby="service-locations-heading"
        className="rounded-3xl bg-white border border-[#72DDAA]/45 p-6 sm:p-8 shadow-xs space-y-4"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2
              id="service-locations-heading"
              className="text-xl sm:text-2xl font-bold text-[#087443]"
            >
              Service Locations
            </h2>
            <p className="mt-1 text-sm text-[#2D4A3B]">
              Cities where our nursing staff is available for home and hospital care.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('setup')}
            className="inline-flex items-center justify-center min-h-[44px] px-4 py-2 rounded-xl bg-[#E8F5E9] text-[#087443] text-sm font-semibold hover:bg-[#d7eed9] transition-colors whitespace-nowrap shrink-0"
          >
            Manage Locations
          </button>
        </div>

        {agency.locations.length === 0 ? (
          <div className="rounded-2xl bg-[#E8F5E9]/70 border border-[#72DDAA]/40 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-[#087443] mt-0.5 shrink-0" aria-hidden="true" />
              <p className="text-sm text-[#11181C]">
                No service cities have been added yet. Add your agency&apos;s service cities in Agency Setup.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('setup')}
              className="inline-flex items-center justify-center min-h-[44px] px-4 py-2 rounded-xl bg-[#087443] text-white text-sm font-semibold hover:bg-[#065E36] transition-colors whitespace-nowrap shrink-0"
            >
              Add Cities
            </button>
          </div>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {agency.locations.map((city) => (
              <li
                key={city}
                className="flex items-center gap-3 rounded-2xl bg-[#E8F5E9] border border-[#72DDAA]/40 px-4 py-3 text-[#064E2E] font-semibold text-sm"
              >
                <MapPin className="w-4 h-4 text-[#087443] shrink-0" aria-hidden="true" />
                <span className="truncate">{city}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Contact Us */}
      <section
        aria-labelledby="contact-us-heading"
        className="rounded-3xl bg-[#E8F5E9] border border-[#72DDAA]/50 p-6 sm:p-8 shadow-xs space-y-6"
      >
        <div>
          <h2
            id="contact-us-heading"
            className="text-xl sm:text-2xl font-bold text-[#087443]"
          >
            Contact Us
          </h2>
          <p className="mt-1 text-sm text-[#11181C]">
            Reach our care coordination team directly by phone, WhatsApp, or email.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-2xl bg-white border border-[#72DDAA]/40 p-4 flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E8F5E9] text-[#087443] flex items-center justify-center shrink-0">
              <Phone className="w-5 h-5" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-[#087443]">Company Phone</p>
              <a
                href={telHref}
                className="mt-0.5 block text-sm sm:text-base font-bold text-[#11181C] hover:text-[#087443] break-all"
              >
                {agency.phoneNumber}
              </a>
            </div>
          </div>

          <div className="rounded-2xl bg-white border border-[#72DDAA]/40 p-4 flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E8F5E9] text-[#087443] flex items-center justify-center shrink-0">
              <MessageCircle className="w-5 h-5" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-[#087443]">WhatsApp Number</p>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-0.5 block text-sm sm:text-base font-bold text-[#11181C] hover:text-[#087443] break-all"
              >
                {agency.whatsappNumber}
              </a>
            </div>
          </div>

          <div className="rounded-2xl bg-white border border-[#72DDAA]/40 p-4 flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E8F5E9] text-[#087443] flex items-center justify-center shrink-0">
              <Mail className="w-5 h-5" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-[#087443]">Email Address</p>
              <a
                href={`mailto:${agency.emailAddress}`}
                className="mt-0.5 block text-sm sm:text-base font-bold text-[#11181C] hover:text-[#087443] break-all"
              >
                {agency.emailAddress}
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href={telHref}
            className="flex-1 inline-flex items-center justify-center gap-2.5 min-h-[48px] px-6 py-3 rounded-2xl bg-[#087443] text-white font-semibold text-base shadow-sm hover:bg-[#065E36] transition-colors whitespace-nowrap"
          >
            <Phone className="w-5 h-5 shrink-0" aria-hidden="true" />
            <span>Call Now</span>
          </a>

          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-2.5 min-h-[48px] px-6 py-3 rounded-2xl bg-white text-[#087443] border border-[#087443]/30 font-semibold text-base shadow-xs hover:bg-[#f4fbf5] transition-colors whitespace-nowrap"
          >
            <MessageCircle className="w-5 h-5 shrink-0" aria-hidden="true" />
            <span>WhatsApp</span>
          </a>
        </div>
      </section>
    </div>
  );
};
