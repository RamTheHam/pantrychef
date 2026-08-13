import type { ButtonHTMLAttributes } from 'react';
import { cx } from '../utils/cx.js';

export interface CameraButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'> {
  /** Accessible name for the shutter. */
  label?: string;
  /** Extra class names appended to the button. */
  className?: string;
}

/**
 * The shutter — a 120px green orb with a white ring, the single hero action of
 * the camera screen. Presses down on `:active`. Put it in a
 * {@link ControlRow} flanked by {@link SideButton}s.
 */
export function CameraButton({
  label = 'Take a photo of your food',
  className,
  type = 'button',
  ...rest
}: CameraButtonProps) {
  return (
    <button type={type} className={cx('camera-btn', className)} aria-label={label} {...rest}>
      <span className="camera-ring" aria-hidden="true" />
    </button>
  );
}
