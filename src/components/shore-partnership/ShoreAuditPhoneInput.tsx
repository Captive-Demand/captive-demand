import { SITE_FORM_INPUT_CLASS, SITE_FORM_LABEL_CLASS } from '@/lib/site-surfaces';

interface ShoreAuditPhoneInputProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
}

export function ShoreAuditPhoneInput({ id, value, onChange }: ShoreAuditPhoneInputProps) {
  return (
    <div>
      <label htmlFor={id} className={SITE_FORM_LABEL_CLASS}>
        Phone number
      </label>
      <input
        id={id}
        required
        type="tel"
        autoComplete="tel"
        inputMode="tel"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`${SITE_FORM_INPUT_CLASS} mt-2`}
      />
    </div>
  );
}
