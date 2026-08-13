import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cx } from '../utils/cx.js';

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> {
  /**
   * `primary` — solid green, the one committing action on a screen.
   * `secondary` — muted ink wash, safe alternatives.
   * `danger` — accent wash, destructive actions like erasing data.
   */
  variant?: 'primary' | 'secondary' | 'danger';
  /** Button label. */
  children?: ReactNode;
  /** Extra class names appended to the button. */
  className?: string;
}

/**
 * The full-width action button used in stacks (settings actions, confirmations).
 * Always 50px tall minimum so it stays thumb-sized on a phone.
 */
export function Button({ variant = 'primary', children, className, type = 'button', ...rest }: ButtonProps) {
  return (
    <button type={type} className={cx(`${variant}-btn`, className)} {...rest}>
      {children}
    </button>
  );
}
