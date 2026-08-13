import type { ReactNode } from 'react';
import { cx } from '../utils/cx.js';

export interface ScreenProps {
  /** Which of the app's four screen layouts to apply. */
  variant?: 'camera' | 'reveal' | 'results' | 'settings';
  /** Hides the screen without unmounting it — how the app switches views. */
  hidden?: boolean;
  /** Screen content. */
  children?: ReactNode;
  /** Extra class names appended to the section. */
  className?: string;
}

/**
 * One full screen inside the {@link AppShell}. PantryChef keeps every screen
 * mounted and toggles `hidden`, so state survives navigation.
 */
export function Screen({ variant = 'results', hidden, children, className }: ScreenProps) {
  return (
    <section className={cx('screen', `screen--${variant}`, className)} hidden={hidden}>
      {children}
    </section>
  );
}
