import type { InputHTMLAttributes } from 'react';
import { cx } from '../utils/cx.js';

export interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'className' | 'size'> {
  /**
   * `md` — the full-width note field on the camera screen.
   * `sm` — the compact comment field inside a {@link RecipeCard}.
   */
  size?: 'md' | 'sm';
  /** Extra class names appended to the input. */
  className?: string;
}

/**
 * A single-line text input on the warm off-white field colour. PantryChef uses
 * placeholders as the only label — keep them conversational.
 */
export function TextField({ size = 'md', className, type = 'text', ...rest }: TextFieldProps) {
  return <input type={type} className={cx(size === 'sm' ? 'comment-input' : 'note-input', className)} {...rest} />;
}
