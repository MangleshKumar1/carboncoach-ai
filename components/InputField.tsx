import { InputHTMLAttributes, forwardRef } from 'react';

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
  icon?: string;
}

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, error, helperText, icon, id, className = '', ...props }, ref) => {
    const inputId = id ?? label.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className={`space-y-1.5 ${className}`}>
        <label htmlFor={inputId} className="block text-sm font-semibold text-slate-700">
          {icon && <span className="mr-1.5">{icon}</span>}
          {label}
        </label>
        <input
          ref={ref}
          id={inputId}
          aria-label={label}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
          className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all duration-200 focus:ring-2 ${
            error
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
              : 'border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20'
          }`}
          {...props}
        />
        {error && (
          <p id={`${inputId}-error`} className="text-xs text-red-500" role="alert" aria-live="polite">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={`${inputId}-helper`} className="text-xs text-slate-500">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

InputField.displayName = 'InputField';

export default InputField;
