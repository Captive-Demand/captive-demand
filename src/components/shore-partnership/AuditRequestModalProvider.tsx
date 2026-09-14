'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';

import {
  AuditRequestModal,
  type AuditRequestModalProps,
} from '@/components/shore-partnership/AuditRequestModal';
import { isDirectBookingPath } from '@/lib/standalone-landers';

type AuditModalOptions = Pick<
  AuditRequestModalProps,
  'analyticsLeadSource' | 'analyticsFormName' | 'portfolioPlaceholder' | 'successMessage'
>;

interface AuditRequestModalContextValue {
  openAuditModal: (options?: AuditModalOptions) => void;
  closeAuditModal: () => void;
}

const AuditRequestModalContext = createContext<AuditRequestModalContextValue | null>(null);

export function AuditRequestModalProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<AuditModalOptions>({});

  const openAuditModal = useCallback((nextOptions?: AuditModalOptions) => {
    setOptions(nextOptions ?? {});
    setOpen(true);
  }, []);

  const closeAuditModal = useCallback(() => {
    setOpen(false);
  }, []);

  const value = useMemo(
    () => ({ openAuditModal, closeAuditModal }),
    [openAuditModal, closeAuditModal],
  );

  // The direct booking lander ships no site modals; keep the context so consumers
  // still resolve, but drop the modal subtree from that route's bundle.
  return (
    <AuditRequestModalContext.Provider value={value}>
      {children}
      {!isDirectBookingPath(pathname) && (
        <AuditRequestModal
          open={open}
          onOpenChange={setOpen}
          variant="full"
          formSource="audit-form"
          recaptchaAction="shore_audit_form"
          analyticsLeadSource={options.analyticsLeadSource ?? 'homepage_audit'}
          analyticsFormName={options.analyticsFormName ?? 'audit-form'}
          portfolioPlaceholder={options.portfolioPlaceholder}
          successMessage={options.successMessage}
        />
      )}
    </AuditRequestModalContext.Provider>
  );
}

export function useAuditRequestModal(): AuditRequestModalContextValue {
  const ctx = useOptionalAuditRequestModal();
  if (!ctx) {
    throw new Error('useAuditRequestModal must be used within AuditRequestModalProvider');
  }
  return ctx;
}

export function useOptionalAuditRequestModal(): AuditRequestModalContextValue | null {
  return useContext(AuditRequestModalContext);
}
