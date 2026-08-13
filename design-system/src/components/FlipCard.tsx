import type { ReactNode } from 'react';
import { cx } from '../utils/cx.js';

export interface FlipCardProps {
  /** The green waiting face, shown first. */
  back?: ReactNode;
  /** The white result face, revealed on flip. */
  front?: ReactNode;
  /** Flips to the result face. */
  flipped?: boolean;
  /** Shakes the card — the app's "thinking" state, before the flip. */
  shaking?: boolean;
  /** Extra class names appended to the card. */
  className?: string;
}

/**
 * The reveal: a card that shakes while the app works, then flips to show the
 * dish. It's the app's whole sense of theatre — don't skip straight to results.
 */
export function FlipCard({ back, front, flipped, shaking, className }: FlipCardProps) {
  return (
    <div className={cx('flip-card', flipped && 'flipped', shaking && 'shake', className)}>
      <div className="flip-card-inner">
        <div className="flip-face flip-back">{back}</div>
        <div className="flip-face flip-front">{front}</div>
      </div>
    </div>
  );
}

export interface RevealSummaryProps {
  /** Dish name, serif. */
  name: string;
  /** One line on the dish. */
  description?: ReactNode;
  /** Cooking time in minutes. */
  timeMinutes?: number;
  /** How many of the user's ingredients it uses — the proof line. */
  usedCount?: number;
}

/**
 * The front face of a {@link FlipCard}: tags, dish name, description and the
 * "0 to buy" proof line.
 */
export function RevealSummary({ name, description, timeMinutes, usedCount = 0 }: RevealSummaryProps) {
  return (
    <div className="reveal-recipe">
      <div className="reveal-meta">
        <span className="match-tag">Exact match</span>
        {timeMinutes != null ? <span className="time-tag">{timeMinutes} min</span> : null}
      </div>
      <h2>{name}</h2>
      {description ? <p className="reveal-desc">{description}</p> : null}
      <div className="reveal-proof">0 to buy · from {usedCount} of your ingredients</div>
    </div>
  );
}
