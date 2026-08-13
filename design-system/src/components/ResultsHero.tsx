import type { ReactNode } from 'react';
import { Chip, ChipGroup } from './Chip.js';
import { Eyebrow } from './Eyebrow.js';
import { cx } from '../utils/cx.js';

export interface ResultsHeroProps {
  /** Accent kicker above the headline. */
  kicker?: ReactNode;
  /** The headline. Wrap the number in a `<span>` to paint it accent orange. */
  title?: ReactNode;
  /** Ingredients the app recognised, rendered as {@link Chip}s. */
  ingredients?: string[];
  /** Shown as a dimmed chip when `ingredients` is empty. */
  emptyLabel?: string;
  /** Extra class names appended to the hero. */
  className?: string;
}

/**
 * The payoff block at the top of the results screen: kicker, big serif count,
 * and the chips proving what the app saw. This is the app's "holy-shit frame" —
 * lead with the number.
 */
export function ResultsHero({
  kicker,
  title,
  ingredients = [],
  emptyLabel = 'No items recognised',
  className,
}: ResultsHeroProps) {
  return (
    <div className={cx('results-hero', className)}>
      {kicker ? <Eyebrow>{kicker}</Eyebrow> : null}
      <h1>{title}</h1>
      <ChipGroup label="Ingredients detected">
        {ingredients.length ? (
          ingredients.map((i) => <Chip key={i}>{i}</Chip>)
        ) : (
          <Chip muted>{emptyLabel}</Chip>
        )}
      </ChipGroup>
    </div>
  );
}
