import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';
import { cn } from '../../lib/cn';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-[#0A66C2] text-white hover:bg-[#0b5cb0] focus-visible:ring-[#0A66C2]/40',
  secondary:
    'border border-[#1E3A5F] bg-[#0F172A] text-[#E8EEF7] hover:bg-[#14203a] focus-visible:ring-[#0A66C2]/30 light:bg-slate-100 light:text-slate-900',
  ghost:
    'bg-transparent text-[#7B8FB0] hover:bg-[#111827] hover:text-[#E8EEF7] focus-visible:ring-[#1E3A5F] light:text-slate-700 light:hover:bg-slate-100',
  danger:
    'bg-[#EF4444] text-white hover:bg-[#dc2626] focus-visible:ring-[#EF4444]/30',
};

export const Button = ({
  children,
  className,
  variant = 'primary',
  ...props
}: PropsWithChildren<ButtonProps>) => (
  <button
    className={cn(
      'inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition duration-200 focus-visible:outline-none focus-visible:ring-4 disabled:cursor-not-allowed disabled:opacity-50',
      variants[variant],
      className,
    )}
    {...props}
  >
    {children}
  </button>
);
