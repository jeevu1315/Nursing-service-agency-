/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Phone } from 'lucide-react';
import { AgencyData, TabId } from './types/agency';
import { formatTelHref, loadAgencyData, saveAgencyData } from './utils/storage';
import { CompanyLogo } from './components/CompanyLogo';
import { PWAInstallButton } from './components/PWAInstallButton';
import { OfflineIndicator } from './components/OfflineIndicator';
import { HomeView } from './components/HomeView';
import { ServicesView } from './components/ServicesView';
import { AgencySetupView } from './components/AgencySetupView';
import { BottomNav } from './components/BottomNav';

export default function App() {
  const [agency, setAgency] = useState<AgencyData>(() => loadAgencyData());
  const [activeTab, setActiveTab] = useState<TabId>('home');
  const [hasUnsavedSetupChanges, setHasUnsavedSetupChanges] = useState(false);

  const handleNavigate = (tab: TabId) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveAgency = (updated: AgencyData) => {
    const result = saveAgencyData(updated);
    if (result.ok) {
      setAgency(updated);
      setHasUnsavedSetupChanges(false);
    }
    return result;
  };

  return (
    <div className="min-h-dvh bg-white text-[#11181C] flex flex-col">
      <OfflineIndicator />

      {/* Top Brand Header (3-zone contract, non-sticky so mobile fixed height stays well under 15%) */}
      <header className="border-b border-[#E8F5E9] bg-white pt-safe">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => handleNavigate('home')}
            className="flex items-center gap-3 min-w-0 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#087443] rounded-xl"
          >
            <CompanyLogo
              logoDataUrl={agency.logoDataUrl}
              companyName={agency.companyName}
              size="sm"
            />
            <span className="font-display text-base sm:text-lg font-bold text-[#087443] truncate">
              {agency.companyName}
            </span>
          </button>

          <div className="flex items-center gap-2.5 shrink-0">
            <PWAInstallButton />
            <a
              href={formatTelHref(agency.phoneNumber)}
              className="inline-flex items-center justify-center gap-2 min-h-[44px] px-4 py-2 rounded-xl bg-[#087443] text-white text-sm font-semibold hover:bg-[#065E36] transition-colors whitespace-nowrap shrink-0"
            >
              <Phone className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>Call Now</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 pt-6 pb-28">
        {activeTab === 'home' && (
          <HomeView agency={agency} onNavigate={handleNavigate} />
        )}
        {activeTab === 'services' && (
          <ServicesView agency={agency} onNavigate={handleNavigate} />
        )}
        {activeTab === 'setup' && (
          <AgencySetupView
            agency={agency}
            onSave={handleSaveAgency}
            onUnsavedChange={setHasUnsavedSetupChanges}
          />
        )}
      </main>

      {/* Bottom Navigation Bar */}
      <BottomNav
        activeTab={activeTab}
        onChangeTab={handleNavigate}
        hasUnsavedSetupChanges={hasUnsavedSetupChanges}
      />
    </div>
  );
}
