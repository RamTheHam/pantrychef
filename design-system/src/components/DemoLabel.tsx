import type { ReactNode } from 'react';
import { cx } from '../utils/cx.js';

export interface DemoLabelProps {
  /** Label text. */
  children?: ReactNode;
  /** Extra class names appended to the label. */
  className?: string;
}

/**
 * The honesty badge. PantryChef shows this on every screen so nobody mistakes
 * the demo for a finished product — keep it visible rather than tucking it away.
 */
export function DemoLabel({ children = 'MVP demo', className }: DemoLabelProps) {
  return <span className={cx('demo-label', className)}>{children}</span>;
}
