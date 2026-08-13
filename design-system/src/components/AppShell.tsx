import type { ReactNode } from 'react';
import { cx } from '../utils/cx.js';

export interface AppShellProps {
  /** Screens and chrome to render inside the phone-width column. */
  children?: ReactNode;
  /** Extra class names appended to the shell. */
  className?: string;
}

/**
 * The phone-width column every PantryChef screen lives in: 480px max width,
 * centred, paper background, full viewport height. Wrap the whole app in it —
 * it also carries the sans type stack and the `--ink` text colour.
 */
export function AppShell({ children, className }: AppShellProps) {
  return <main className={cx('app-shell', className)}>{children}</main>;
}
