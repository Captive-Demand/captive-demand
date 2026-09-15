import { TRUST_LINE } from '@/components/landers/direct-booking/copy';
import { CheckIcon } from '@/components/landers/direct-booking/icons';

interface TrustLineProps {
  /** `dark` sits on ink, `light` sits on paper. */
  tone?: 'dark' | 'light';
  className?: string;
}

export function TrustLine({ tone = 'dark', className = '' }: TrustLineProps) {
  const text = tone === 'dark' ? 'text-[#FAF9F6]/[0.62]' : 'text-[#1a1512]/65';
  return (
    <p className={`flex items-start gap-2 text-[13px] leading-[1.45] md:text-sm ${text} ${className}`}>
      <CheckIcon className="mt-px shrink-0 text-[#FF5501]" />
      <span>{TRUST_LINE}</span>
    </p>
  );
}
