import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="bg-[#E8F5E9] border-b border-[#72DDAA] px-4 py-2 text-xs font-medium text-[#064E2E] flex items-center justify-center gap-2"
    >
      <WifiOff className="w-4 h-4 text-[#087443] shrink-0" aria-hidden="true" />
      <span>Offline mode active — showing saved agency information.</span>
    </div>
  );
};
