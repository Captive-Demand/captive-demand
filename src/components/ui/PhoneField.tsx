'use client';

import { useId, useState } from 'react';

import { validatePhone } from '@/lib/phone';
import { SITE_FORM_INPUT_CLASS, SITE_FORM_LABEL_CLASS } from '@/lib/site-surfaces';

export interface PhoneFieldProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  /** Parent sets this after a failed submit so the message shows even if the field was never blurred. */
  showError?: boolean;
  /** Optional helper line under the field, shown when there is no error. */
  hint?: string;
  labelClassName?: string;
  inputClassName?: string;
  /** Applied to the input on top of `inputClassName` while the value is invalid and the error is showing. */
  invalidClassName?: string;
  errorClassName?: string;
  hintClassName?: string;
  className?: string;
  onFocus?: () => void;
}

/**
 * The one phone input for every lead form. Validates on blur and on demand,
 * rewrites a valid number into a consistent display form, and always sends
 * the raw text up so the parent can run `validatePhone` again on submit.
 */
export function PhoneField({
  id,
  value,
  onChange,
  label = 'Phone number',
  placeholder = '(615) 555-0123',
  showError = false,
  hint,
  labelClassName = SITE_FORM_LABEL_CLASS,
  inputClassName = `${SITE_FORM_INPUT_CLASS} mt-2`,
  invalidClassName = 'border-red-500 focus:border-red-500',
  errorClassName = 'mt-2 block text-[13px] leading-snug text-red-600',
  hintClassName = 'mt-2 block text-[13px] leading-snug text-[#1a1512]/55',
  className,
  onFocus,
}: PhoneFieldProps) {
  const [touched, setTouched] = useState(false);
  const messageId = useId();

  const validation = validatePhone(value);
  const showMessage = (touched || showError) && !validation.ok;

  const handleBlur = () => {
    setTouched(true);
    if (validation.ok && validation.display && validation.display !== value) {
      onChange(validation.display);
    }
  };

  return (
    <div className={className}>
      <label htmlFor={id} className={labelClassName}>
        {label}
      </label>
      <input
        id={id}
        name="phone"
        required
        type="tel"
        autoComplete="tel"
        inputMode="tel"
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onBlur={handleBlur}
        onFocus={onFocus}
        aria-invalid={showMessage || undefined}
        aria-describedby={showMessage || hint ? messageId : undefined}
        className={`${inputClassName} ${showMessage ? invalidClassName : ''}`}
      />
      {showMessage ? (
        <span id={messageId} role="alert" className={errorClassName}>
          {validation.message}
        </span>
      ) : hint ? (
        <span id={messageId} className={hintClassName}>
          {hint}
        </span>
      ) : null}
    </div>
  );
}
