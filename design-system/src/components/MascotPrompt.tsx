import type { ReactNode } from 'react';
import { cx } from '../utils/cx.js';

export interface MascotPromptProps {
  /** Basil's glyph. Defaults to the herb sprig the app ships. */
  avatar?: ReactNode;
  /** What Basil says — serif, sentence case, no exclamation marks. */
  children?: ReactNode;
  /** `lg` blows the avatar up to 46px for the reveal card. */
  size?: 'md' | 'lg';
  /** Extra class names appended to the row. */
  className?: string;
}

/**
 * Basil, the app's voice: an emoji avatar beside a line of serif text. This is
 * how PantryChef gives instructions — never as a system message.
 */
export function MascotPrompt({ avatar = '🌿', children, size = 'md', className }: MascotPromptProps) {
  return (
    <div className={cx('mascot-prompt', className)}>
      <span className={cx('mascot-avatar', size === 'lg' && 'big')} aria-hidden="true">{avatar}</span>
      <p className="mascot-prompt-line">{children}</p>
    </div>
  );
}
