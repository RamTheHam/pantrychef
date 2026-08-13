import type { ReactNode } from 'react';
import { cx } from '../utils/cx.js';

export interface BrandRowProps {
  /** Left slot — usually a back or retake {@link TextButton}. */
  left?: ReactNode;
  /** Right slot — a second {@link TextButton} or a {@link DemoLabel}. */
  right?: ReactNode;
  /** Extra class names appended to the header. */
  className?: string;
}

/**
 * The navigation row on inner screens: one control on each end. Distinct from
 * {@link TopBar}, which carries the wordmark.
 */
export function BrandRow({ left, right, className }: BrandRowProps) {
  return (
    <header className={cx('brand-row', className)}>
      {left}
      {right}
    </header>
  );
}
