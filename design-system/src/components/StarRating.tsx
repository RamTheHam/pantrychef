import { cx } from '../utils/cx.js';

export interface StarRatingProps {
  /** Stars currently filled, 0–`max`. */
  value?: number;
  /** How many stars to show. */
  max?: number;
  /** Called with the clicked star's value. Omit for a read-only display. */
  onRate?: (value: number) => void;
  /** Renders static 16px stars instead of tappable 24px ones. */
  readOnly?: boolean;
  /** Extra class names appended to the row. */
  className?: string;
}

/**
 * The gold five-star grade. Interactive on a {@link RecipeCard}; read-only in
 * {@link HistoryItem}, where it records what the cook thought.
 */
export function StarRating({ value = 0, max = 5, onRate, readOnly, className }: StarRatingProps) {
  const stars = Array.from({ length: max }, (_, i) => i + 1);
  return (
    <span className={cx('star-row', readOnly && 'static', className)} role={readOnly ? 'img' : undefined}
      aria-label={readOnly ? `${value} out of ${max} stars` : undefined}>
      {stars.map((s) =>
        readOnly ? (
          <span key={s} className={cx('star', 'static', s <= value && 'on')} aria-hidden="true">★</span>
        ) : (
          <button
            key={s}
            type="button"
            className={cx('star', s <= value && 'on')}
            aria-label={`${s} stars`}
            onClick={() => onRate?.(s)}
          >
            ★
          </button>
        )
      )}
    </span>
  );
}
