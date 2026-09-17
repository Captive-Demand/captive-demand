import { PhoneField, type PhoneFieldProps } from '@/components/ui/PhoneField';

type ShoreAuditPhoneInputProps = Pick<PhoneFieldProps, 'id' | 'value' | 'onChange' | 'showError'>;

/** Kept for existing imports; the shared PhoneField does the work. */
export function ShoreAuditPhoneInput(props: ShoreAuditPhoneInputProps) {
  return <PhoneField {...props} />;
}
