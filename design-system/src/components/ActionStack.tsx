import type { ReactNode } from 'react';
import { cx } from '../utils/cx.js';

export interface ActionStackProps {
  /** Full-width {@link Button}s, most important first. */
  children?: ReactNode;
  /** Extra class names appended to the stack. */
  className?: string;
}

/**
 * A vertical stack of full-width {@link Button}s with 10px gaps — the settings
 * screen's action group. Order matters: primary, then secondary, then danger.
 */
export function ActionStack({ children, className }: ActionStackProps) {
  return <div className={cx('settings-actions', className)}>{children}</div>;
}
