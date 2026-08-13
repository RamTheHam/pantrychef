import type { ReactNode } from 'react';
import { cx } from '../utils/cx.js';

export interface EyebrowProps {
  /** Short kicker text, rendered uppercase in accent orange. */
  children?: ReactNode;
  /** Extra class names appended to the paragraph. */
  className?: string;
}

/**
 * The small accent kicker that sits above a headline and says what the screen
 * is about.
 */
export function Eyebrow({ children, className }: EyebrowProps) {
  return <p className={cx('eyebrow', className)}>{children}</p>;
}
