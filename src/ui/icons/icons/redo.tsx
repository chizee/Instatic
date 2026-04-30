import React from 'react';
import type { IconProps } from '../types';

export function RedoIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect width="14" height="2" transform="matrix(-1 0 0 1 20 8)" fill={color}/>
      <rect x="4" y="10" width="2" height="8" fill={color}/>
      <rect x="6" y="18" width="6" height="2" fill={color}/>
      <rect width="2" height="6" transform="matrix(-1 0 0 1 18 6)" fill={color}/>
      <rect width="2" height="8" transform="matrix(-1 0 0 1 16 4)" fill={color}/>
      <rect width="2" height="2" transform="matrix(-1 0 0 1 16 12)" fill={color}/>
    </svg>
  );
}
