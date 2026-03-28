import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';
import { cn } from '../../lib/cn';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-brand-teal text-white hover:bg-brand-teal/90 focus-visible:ring-brand-teal/40',
  secondary:
    'bg-white/10 text-white hover:bg-white/15 focus-visible:ring-white/20 light:bg-slate-100 light:text-slate-900',
  ghost:
    'bg-transparent text-slate-200 hover:bg-white/10 focus-visible:ring-white/20 light:text-slate-700 light:hover:bg-slate-100',
  danger:
    'bg-rose-500/90 text-white hover:bg-rose-500 focus-visible:ring-rose-500/30',
};

export const Button = ({
  children,
  className,
  variant = 'primary',
  ...props
}: PropsWithChildren<ButtonProps>) => (
  <button
    className={cn(
      'inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-semibold transition duration-200 focus-visible:outline-none focus-visible:ring-4 disabled:cursor-not-allowed disabled:opacity-50',
      variants[variant],
      className,
    )}
    {...props}
  >
    {children}
  </button>
);
