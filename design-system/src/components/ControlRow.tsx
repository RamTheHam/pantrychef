import type { ReactNode } from 'react';
import { cx } from '../utils/cx.js';

export interface ControlRowProps {
  /** The shutter and its flanking controls. */
  children?: ReactNode;
  /** Extra class names appended to the row. */
  className?: string;
}

/**
 * Centres the camera controls on one line with 30px gaps — the
 * {@link CameraButton} between two {@link SideButton}s.
 */
export function ControlRow({ children, className }: ControlRowProps) {
  return (
    <div className={cx('camera-stage', className)}>
      <div className="control-row">{children}</div>
    </div>
  );
}
