import type { ReactNode } from 'react';
import { cx } from '../utils/cx.js';

export interface ProTipProps {
  /** The tip itself — one sentence of practical cooking advice. */
  children?: ReactNode;
  /** Overrides the uppercase gold label. */
  label?: ReactNode;
  /** Extra class names appended to the block. */
  className?: string;
}

/**
 * A gold-washed aside carrying one piece of cooking advice. Used at the foot
 * of a {@link RecipeCard}'s method.
 */
export function ProTip({ children, label = 'Pro tip', className }: ProTipProps) {
  return (
    <div className={cx('pro-tip', className)}>
      <span className="pro-tip-label">{label}</span>
      <p>{children}</p>
    </div>
  );
}
