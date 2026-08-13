import type { ReactNode } from 'react';
import { cx } from '../utils/cx.js';

export interface PageTitleProps {
  /** The heading text, serif. */
  children?: ReactNode;
  /** Supporting sentence under the heading, soft ink. */
  subtitle?: ReactNode;
  /** Optional count line, e.g. `4 dishes cooked`. */
  meta?: ReactNode;
  /** Extra class names appended to the wrapper. */
  className?: string;
}

/**
 * The serif heading for inner screens (history, settings) with its optional
 * subtitle and count line. The results screen uses {@link ResultsHero} instead.
 */
export function PageTitle({ children, subtitle, meta, className }: PageTitleProps) {
  return (
    <div className={className}>
      <h1 className={cx('settings-title')}>{children}</h1>
      {meta ? <p className="history-count">{meta}</p> : null}
      {subtitle ? <p className="settings-sub">{subtitle}</p> : null}
    </div>
  );
}
