'use client';

import { AnimatedCTAButton } from '@/components/sections/Hero';
import { useOptionalAuditRequestModal } from '@/components/shore-partnership/AuditRequestModalProvider';

export interface AuditCTAButtonProps {
  buttonText: string;
  ariaLabel?: string;
  leadSource?: string;
}

export function AuditCTAButton({
  buttonText,
  ariaLabel,
  leadSource = 'service_audit',
}: AuditCTAButtonProps) {
  const auditModal = useOptionalAuditRequestModal();

  return (
    <AnimatedCTAButton
      buttonText={buttonText}
      ariaLabel={ariaLabel ?? buttonText}
      href="/contact"
      onClick={
        auditModal
          ? () =>
              auditModal.openAuditModal({
                analyticsLeadSource: leadSource,
                analyticsFormName: 'audit-form',
              })
          : undefined
      }
    />
  );
}
