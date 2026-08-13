import type { ReactNode } from 'react';
import { cx } from '../utils/cx.js';

export interface ChipProps {
  /** The ingredient name — capitalised, one or two words. */
  children?: ReactNode;
  /** Dims the chip to 60% — used for the "nothing recognised" placeholder. */
  muted?: boolean;
  /** Extra class names appended to the chip. */
  className?: string;
}

/**
 * A pill naming one thing the app saw on the counter. Chips are read-only —
 * they report, they don't filter.
 */
export function Chip({ children, muted, className }: ChipProps) {
  return <span className={cx('seen-chip', muted && 'muted', className)}>{children}</span>;
}

export interface ChipGroupProps {
  /** The {@link Chip}s to wrap. */
  children?: ReactNode;
  /** Accessible name for the group. */
  label?: string;
  /** Extra class names appended to the group. */
  className?: string;
}

/** Wraps {@link Chip}s onto as many rows as they need with a 6px gap. */
export function ChipGroup({ children, label, className }: ChipGroupProps) {
  return (
    <div className={cx('seen-chips', className)} aria-label={label}>
      {children}
    </div>
  );
}
