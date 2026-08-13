import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cx } from '../utils/cx.js';

export interface SideButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'> {
  /** Glyph shown above the label. */
  icon: ReactNode;
  /** Short caption, e.g. `Library` or `x2`. */
  label: string;
  /** Turns the icon accent-orange to show the mode is engaged. */
  active?: boolean;
  /** Extra class names appended to the button. */
  className?: string;
}

/**
 * A stacked icon-over-label control that flanks the {@link CameraButton} —
 * the library picker and the multi-shot toggle.
 */
export function SideButton({ icon, label, active, className, type = 'button', ...rest }: SideButtonProps) {
  return (
    <button
      type={type}
      className={cx('side-btn', active && 'active', className)}
      aria-pressed={active}
      {...rest}
    >
      <span className="side-icon" aria-hidden="true">{icon}</span>
      <span className="side-label">{label}</span>
    </button>
  );
}
