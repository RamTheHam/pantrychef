import type { ReactNode } from 'react';
import { cx } from '../utils/cx.js';

export interface TagProps {
  /**
   * `match` — green, whether the recipe is an exact match.
   * `time` — accent, minutes to cook.
   * `serve` — ink, how many it feeds.
   * `diet` — gold, a dietary trait like Vegetarian.
   */
  tone?: 'match' | 'time' | 'serve' | 'diet';
  /** Tag text — rendered uppercase at 9px, so keep it to a few words. */
  children?: ReactNode;
  /** Extra class names appended to the tag. */
  className?: string;
}

const CLASS = {
  match: 'match-tag',
  time: 'time-tag',
  serve: 'serve-tag',
  diet: 'diet-chip',
} as const;

/**
 * A tiny uppercase metadata pill. The tone carries the meaning — green for
 * match quality, accent for time, gold for diet — so pick by meaning, not colour.
 */
export function Tag({ tone = 'match', children, className }: TagProps) {
  return <span className={cx(CLASS[tone], className)}>{children}</span>;
}
