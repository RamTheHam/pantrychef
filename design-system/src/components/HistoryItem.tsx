import type { ReactNode } from 'react';
import { StarRating } from './StarRating.js';
import { cx } from '../utils/cx.js';

export interface HistoryItemProps {
  /** Dish name, serif. */
  name: string;
  /** Stars the cook gave it. */
  stars?: number;
  /** What they said about it — rendered in italics, quotes included by the app. */
  comment?: ReactNode;
  /** Extra class names appended to the row. */
  className?: string;
}

/**
 * One dish the cook already made, with their grade and their own words. The
 * record of taste PantryChef builds its suggestions from.
 */
export function HistoryItem({ name, stars = 0, comment, className }: HistoryItemProps) {
  return (
    <div className={cx('history-item', className)}>
      <div className="history-top">
        <span className="history-name">{name}</span>
        <StarRating value={stars} readOnly />
      </div>
      {comment ? <p className="history-comment">&ldquo;{comment}&rdquo;</p> : null}
    </div>
  );
}

export interface HistoryListProps {
  /** The {@link HistoryItem}s to stack. */
  children?: ReactNode;
  /** Shown instead of the children when there's nothing cooked yet. */
  emptyMessage?: ReactNode;
  /** Extra class names appended to the list. */
  className?: string;
}

/** Stacks {@link HistoryItem}s, or shows the empty-state sentence. */
export function HistoryList({ children, emptyMessage, className }: HistoryListProps) {
  return (
    <div className={cx('history-list', className)}>
      {children ?? <p className="history-empty">{emptyMessage}</p>}
    </div>
  );
}
