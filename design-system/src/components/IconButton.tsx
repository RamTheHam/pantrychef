import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cx } from '../utils/cx.js';

export interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'> {
  /** The glyph to show — PantryChef uses text symbols and emoji, not an icon font. */
  icon: ReactNode;
  /** Accessible name. Required: the glyph alone conveys nothing to a screen reader. */
  label: string;
  /** Extra class names appended to the button. */
  className?: string;
}

/**
 * A 36px round icon affordance on a soft ink wash — the settings cog in the
 * {@link TopBar} is the canonical use.
 */
export function IconButton({ icon, label, className, type = 'button', ...rest }: IconButtonProps) {
  return (
    <button type={type} className={cx('icon-btn', className)} aria-label={label} {...rest}>
      <span aria-hidden="true">{icon}</span>
    </button>
  );
}
