import type { ReactNode } from 'react';
import { cx } from '../utils/cx.js';

export interface SummaryRow {
  /** Left-hand key, bold soft ink. */
  label: string;
  /** Right-aligned value. The app uses an em dash for "nothing yet". */
  value: ReactNode;
}

export interface SummaryListProps {
  /** The key/value rows, hairline-separated. */
  items?: SummaryRow[];
  /** Extra class names appended to the box. */
  className?: string;
}

/**
 * A white card of key/value rows. PantryChef uses it for the one honest screen
 * in the app — exactly what data leaves the phone, in plain words.
 */
export function SummaryList({ items = [], className }: SummaryListProps) {
  return (
    <div className={cx('summary-box', className)}>
      {items.map((row) => (
        <div className="summary-kv" key={row.label}>
          <span className="k">{row.label}</span>
          <span className="v">{row.value}</span>
        </div>
      ))}
    </div>
  );
}
