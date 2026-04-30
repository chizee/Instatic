import React from 'react';
import type { IconProps } from '../types';

export function SignalZeroIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
    >
      <rect x="3" y="19" width="2" height="2" fill={color}/>
    </svg>
  );
}
