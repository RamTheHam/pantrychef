import type { ReactNode } from 'react';
import { DemoLabel } from './DemoLabel.js';
import { cx } from '../utils/cx.js';

export interface SiteFooterProps {
  /** Badge text. Set to `null` to drop the badge. */
  label?: ReactNode;
  /** The honesty line under the badge — what's stored, what's shared. */
  children?: ReactNode;
  /** Extra class names appended to the footer. */
  className?: string;
}

/**
 * The centred footer carrying the {@link DemoLabel} and the scope line. Every
 * screen that shows results ends with one — it's how the app stays honest.
 */
export function SiteFooter({ label = 'MVP demo', children, className }: SiteFooterProps) {
  return (
    <footer className={cx('site-footer', className)}>
      {label ? <DemoLabel>{label}</DemoLabel> : null}
      {children ? <p>{children}</p> : null}
    </footer>
  );
}
