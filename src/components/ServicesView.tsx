import React, { useState } from 'react';
import { Phone, MessageCircle, Stethoscope, Settings } from 'lucide-react';
import { AgencyData, TabId } from '../types/agency';
import { formatTelHref, formatWhatsAppHref } from '../utils/storage';
import { ServiceIcon } from './ServiceIcon';
import servicesBanner from '../assets/images/nursing_services_banner_1794645928896.jpg';

interface ServicesViewProps {
  agency: AgencyData;
  onNavigate: (tab: TabId) => void;
}

export const ServicesView: React.FC<ServicesViewProps> = ({ agency, onNavigate }) => {
  const [bannerFailed, setBannerFailed] = useState(false);

  const telHref = formatTelHref(agency.phoneNumber);
  const whatsappBase = agency.whatsappNumber.replace(/\D/g, '');

  const buildServiceWhatsAppHref = (serviceTitle: string) => {
    if (!whatsappBase) return formatWhatsAppHref(agency.whatsappNumber, agency.companyName);
    const msg = encodeURIComponent(
      `Hello ${agency.companyName}, I would like to inquire about ${serviceTitle}.`
    );
    return `https://wa.me/${whatsappBase}?text=${msg}`;
  };

  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-[#E8F5E9] border border-[#72DDAA]/50 p-6 sm:p-8 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#087443]">
              Our Nursing Services
            </h1>
            <p className="mt-1.5 text-sm sm:text-base text-[#11181C]">
              Dedicated nursing support tailored for home recovery and hospital bedside care.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('setup')}
            className="inline-flex items-center justify-center gap-2 min-h-[44px] px-4 py-2 rounded-xl bg-white text-[#087443] border border-[#72DDAA] text-sm font-semibold hover:bg-[#f4fbf5] transition-colors whitespace-nowrap shrink-0"
          >
            <Settings className="w-4 h-4" aria-hidden="true" />
            <span>Manage Services</span>
          </button>
        </div>

        <div className="rounded-2xl overflow-hidden bg-white border border-[#72DDAA]/40 aspect-[16/9] max-h-64 w-full flex items-center justify-center">
          {!bannerFailed ? (
            <img
              src={servicesBanner}
              alt="Home nursing care and hospital bedside nursing support illustration"
              referrerPolicy="no-referrer"
              onError={() => setBannerFailed(true)}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="p-6 flex flex-col items-center justify-center gap-2 text-[#087443]">
              <Stethoscope className="w-10 h-10" aria-hidden="true" />
              <span className="text-sm font-semibold">{agency.companyName} Services</span>
            </div>
          )}
        </div>
      </section>

      <section aria-label="Service offerings" className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {agency.services.map((service) => (
          <article
            key={service.id}
            className="rounded-3xl bg-[#E8F5E9] border border-[#72DDAA]/45 p-6 shadow-xs flex flex-col justify-between gap-5"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#087443] text-white flex items-center justify-center shrink-0 shadow-xs">
                  <ServiceIcon icon={service.icon} className="w-7 h-7" />
                </div>
                <h2 className="text-xl font-bold text-[#087443]">{service.title}</h2>
              </div>
              <p className="text-sm sm:text-base leading-relaxed text-[#11181C]">
                {service.description}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 pt-2 border-t border-[#72DDAA]/35">
              <a
                href={telHref}
                className="flex-1 inline-flex items-center justify-center gap-2 min-h-[44px] px-4 py-2.5 rounded-xl bg-[#087443] text-white text-sm font-semibold hover:bg-[#065E36] transition-colors whitespace-nowrap"
              >
                <Phone className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>Call Now</span>
              </a>
              <a
                href={buildServiceWhatsAppHref(service.title)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 min-h-[44px] px-4 py-2.5 rounded-xl bg-white text-[#087443] border border-[#72DDAA] text-sm font-semibold hover:bg-[#f4fbf5] transition-colors whitespace-nowrap"
              >
                <MessageCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>WhatsApp</span>
              </a>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
};
