import type { ReactNode } from 'react';
import { ProTip } from './ProTip.js';
import { StarRating } from './StarRating.js';
import { Tag } from './Tag.js';
import { TextField } from './TextField.js';
import { cx } from '../utils/cx.js';

export interface RecipeCardProps {
  /** Dish name — serif, sentence case. */
  name: string;
  /** One or two lines on what the dish is and why it fits. */
  description?: ReactNode;
  /** Cooking time in minutes. */
  timeMinutes?: number;
  /** How many the dish feeds. Omit to hide the serves tag. */
  serves?: number;
  /** `exact` means nothing needs buying; `closest` means `missing` is non-empty. */
  match?: 'exact' | 'closest';
  /** How many of the user's own ingredients the dish uses. */
  usedCount?: number;
  /** Ingredients the user would still need to buy. */
  missing?: string[];
  /** Dietary traits, shown as gold {@link Tag}s. */
  dietary?: string[];
  /** Everything the recipe uses, listed under "Uses only". */
  ingredients?: string[];
  /** Numbered method steps. */
  steps?: string[];
  /** Optional gold {@link ProTip} under the method. */
  proTip?: ReactNode;
  /** Outlines the card in accent — reserve it for the single best match. */
  featured?: boolean;
  /** Opens the ingredients-and-method disclosure on first render. */
  defaultOpen?: boolean;
  /** Stars already given. Omit the grade row entirely by leaving `onRate` unset. */
  grade?: number;
  /** Called when the cook grades the dish — showing the row requires this. */
  onRate?: (stars: number) => void;
  /** Extra class names appended to the card. */
  className?: string;
}

/**
 * One recipe, whole: metadata tags, name, description, the proof line, a
 * collapsed method, and the grading row. This is the densest component in the
 * system and the one the results list is built from — pass real recipe data,
 * not placeholders.
 */
export function RecipeCard({
  name,
  description,
  timeMinutes,
  serves,
  match = 'exact',
  usedCount = 0,
  missing = [],
  dietary = [],
  ingredients = [],
  steps = [],
  proTip,
  featured,
  defaultOpen,
  grade = 0,
  onRate,
  className,
}: RecipeCardProps) {
  const buyTag = match === 'exact' ? 'Nothing to buy' : `${missing.length} to buy`;
  return (
    <article className={cx('recipe-card', featured && 'featured', className)}>
      <div className="recipe-main">
        <div className="recipe-meta">
          <Tag tone="match">{match === 'exact' ? 'Exact match' : 'Closest'}</Tag>
          {timeMinutes != null ? <Tag tone="time">{timeMinutes} min</Tag> : null}
          {serves != null ? <Tag tone="serve">Serves {serves}</Tag> : null}
        </div>
        <h2>{name}</h2>
        {description ? <p className="recipe-description">{description}</p> : null}
        {dietary.length ? (
          <div className="diet-row">
            {dietary.map((d) => (
              <Tag key={d} tone="diet">{d}</Tag>
            ))}
          </div>
        ) : null}
        <div className="recipe-proof">
          <span>{usedCount} of your ingredients</span>
          <span>{buyTag}</span>
        </div>
      </div>

      {ingredients.length || steps.length ? (
        <details className="recipe-details" open={defaultOpen}>
          <summary>See ingredients &amp; method</summary>
          <div className="recipe-body">
            {ingredients.length ? (
              <>
                <h3>Uses only</h3>
                <ul>{ingredients.map((i) => <li key={i}>{i}</li>)}</ul>
              </>
            ) : null}
            {missing.length ? (
              <>
                <h3>You&rsquo;d need</h3>
                <p className="missing-list">{missing.join(', ')}</p>
              </>
            ) : null}
            {steps.length ? (
              <>
                <h3>Method</h3>
                <ol>{steps.map((s, i) => <li key={i}>{s}</li>)}</ol>
              </>
            ) : null}
            {proTip ? <ProTip>{proTip}</ProTip> : null}
          </div>
        </details>
      ) : null}

      {onRate ? (
        <div className="grade-row">
          <span className="grade-prompt">Grade it and I&rsquo;ll know you made it:</span>
          <StarRating value={grade} onRate={onRate} />
          <TextField size="sm" placeholder="one word if you like…" maxLength={80} />
        </div>
      ) : null}
    </article>
  );
}

export interface RecipeListProps {
  /** The {@link RecipeCard}s to stack. */
  children?: ReactNode;
  /** Extra class names appended to the list. */
  className?: string;
}

/** Stacks {@link RecipeCard}s in a 12px-gap column. */
export function RecipeList({ children, className }: RecipeListProps) {
  return <div className={cx('recipe-list', className)}>{children}</div>;
}
