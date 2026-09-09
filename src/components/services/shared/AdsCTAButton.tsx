'use client';

import { AnimatedCTAButton } from '@/components/sections/Hero';
import { useOptionalAdsRequestModal } from '@/components/services/advertising/AdsRequestModalProvider';

export interface AdsCTAButtonProps {
  buttonText: string;
  ariaLabel?: string;
  leadSource?: string;
}

export function AdsCTAButton({
  buttonText,
  ariaLabel,
  leadSource = 'advertising_service_audit',
}: AdsCTAButtonProps) {
  const adsModal = useOptionalAdsRequestModal();

  return (
    <AnimatedCTAButton
      buttonText={buttonText}
      ariaLabel={ariaLabel ?? buttonText}
      href="/contact"
      onClick={adsModal ? () => adsModal.openAdsModal(leadSource) : undefined}
    />
  );
}
