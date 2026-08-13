import type { InputHTMLAttributes, ReactNode } from 'react';
import { cx } from '../utils/cx.js';

export interface CheckboxRowProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'className' | 'type' | 'children'> {
  /** The label text sitting beside the box — a full sentence, not a word. */
  children?: ReactNode;
  /** Extra class names appended to the label. */
  className?: string;
}

/**
 * A checkbox and its sentence on one tappable ink-wash row. The whole row is
 * the label, so anywhere on it toggles.
 */
export function CheckboxRow({ children, className, ...rest }: CheckboxRowProps) {
  return (
    <label className={cx('basics-toggle', className)}>
      <input type="checkbox" {...rest} />
      <span>{children}</span>
    </label>
  );
}
