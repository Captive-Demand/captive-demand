'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';

import { AdsRequestModal } from '@/components/services/advertising/AdsRequestModal';
import { isDirectBookingPath } from '@/lib/standalone-landers';

interface AdsRequestModalContextValue {
  openAdsModal: (leadSource?: string) => void;
  closeAdsModal: () => void;
}

const AdsRequestModalContext = createContext<AdsRequestModalContextValue | null>(null);

export function AdsRequestModalProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [leadSource, setLeadSource] = useState('advertising_service_audit');

  const openAdsModal = useCallback((nextLeadSource?: string) => {
    if (nextLeadSource) setLeadSource(nextLeadSource);
    setOpen(true);
  }, []);

  const closeAdsModal = useCallback(() => {
    setOpen(false);
  }, []);

  const value = useMemo(
    () => ({ openAdsModal, closeAdsModal }),
    [openAdsModal, closeAdsModal],
  );

  return (
    <AdsRequestModalContext.Provider value={value}>
      {children}
      {!isDirectBookingPath(pathname) && (
        <AdsRequestModal
          open={open}
          onOpenChange={setOpen}
          analyticsLeadSource={leadSource}
        />
      )}
    </AdsRequestModalContext.Provider>
  );
}

export function useOptionalAdsRequestModal(): AdsRequestModalContextValue | null {
  return useContext(AdsRequestModalContext);
}
