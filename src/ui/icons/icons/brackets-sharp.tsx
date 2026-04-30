import React from 'react';
import type { IconProps } from '../types';

export function BracketsSharpIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="3" y="4" width="6" height="2" fill={color}/>
      <rect width="6" height="2" transform="matrix(-1 0 0 1 21 4)" fill={color}/>
      <rect width="6" height="2" transform="matrix(1 0 0 -1 3 20)" fill={color}/>
      <rect x="21" y="20" width="6" height="2" transform="rotate(180 21 20)" fill={color}/>
      <rect x="3" y="6" width="2" height="12" fill={color}/>
      <rect width="2" height="12" transform="matrix(-1 0 0 1 21 6)" fill={color}/>
    </svg>
  );
}
