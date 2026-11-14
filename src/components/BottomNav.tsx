import React from 'react';
import { Home, Stethoscope, Settings } from 'lucide-react';
import { TabId } from '../types/agency';

interface BottomNavProps {
  activeTab: TabId;
  onChangeTab: (tab: TabId) => void;
  hasUnsavedSetupChanges?: boolean;
}

const NAV_ITEMS: { id: TabId; label: string; icon: React.FC<{ className?: string }> }[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'services', label: 'Services', icon: Stethoscope },
  { id: 'setup', label: 'Agency Setup', icon: Settings },
];

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onChangeTab,
  hasUnsavedSetupChanges = false,
}) => {
  return (
    <nav
      aria-label="Primary navigation"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#72DDAA]/45 shadow-[0_-4px_20px_rgba(8,116,67,0.06)] pb-safe"
    >
      <div className="max-w-3xl mx-auto grid grid-cols-3 h-16 px-2">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onChangeTab(item.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`min-h-[44px] flex flex-col items-center justify-center gap-1 rounded-2xl mx-1 my-1.5 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#087443] ${
                isActive
                  ? 'bg-[#E8F5E9] text-[#087443] font-semibold'
                  : 'text-[#2D4A3B] hover:bg-[#E8F5E9]/50 hover:text-[#087443] font-medium'
              }`}
            >
              <div className="relative flex items-center justify-center">
                <Icon className="w-5 h-5" aria-hidden="true" />
                {item.id === 'setup' && hasUnsavedSetupChanges && (
                  <span className="sr-only">(unsaved changes)</span>
                )}
              </div>
              <span className="text-[11px] leading-none whitespace-nowrap">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
