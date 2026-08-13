import type { ReactNode } from 'react';
import { cx } from '../utils/cx.js';

export interface TopBarProps {
  /** Wordmark shown on the left — the serif brand type. */
  brand?: ReactNode;
  /** Right-hand slot, typically an {@link IconButton}. */
  actions?: ReactNode;
  /** Extra class names appended to the header. */
  className?: string;
}

/**
 * The app's masthead: serif wordmark on the left, one action on the right.
 * Used on the camera screen.
 */
export function TopBar({ brand = 'PantryChef', actions, className }: TopBarProps) {
  return (
    <header className={cx('topbar', className)}>
      <span className="brand">{brand}</span>
      {actions}
    </header>
  );
}
