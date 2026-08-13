import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cx } from '../utils/cx.js';

export interface TextButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> {
  /** Label — include the arrow glyph for back-style controls, e.g. `← Retake`. */
  children?: ReactNode;
  /** Extra class names appended to the button. */
  className?: string;
}

/**
 * A chromeless text control in soft ink. Used for navigation inside a
 * {@link BrandRow}, never as a primary action.
 */
export function TextButton({ children, className, type = 'button', ...rest }: TextButtonProps) {
  return (
    <button type={type} className={cx('text-btn', className)} {...rest}>
      {children}
    </button>
  );
}
