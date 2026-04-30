import React from 'react';
import type { IconProps } from '../types';

export function BracesSharpIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="4" y="4" width="6" height="2" fill={color}/>
      <rect width="6" height="2" transform="matrix(-1 0 0 1 20 4)" fill={color}/>
      <rect width="6" height="2" transform="matrix(1 0 0 -1 4 20)" fill={color}/>
      <rect x="20" y="20" width="6" height="2" transform="rotate(180 20 20)" fill={color}/>
      <rect x="4" y="6" width="2" height="5" fill={color}/>
      <rect width="2" height="5" transform="matrix(-1 0 0 1 20 6)" fill={color}/>
      <rect width="2" height="5" transform="matrix(1 0 0 -1 4 18)" fill={color}/>
      <rect x="20" y="18" width="2" height="5" transform="rotate(180 20 18)" fill={color}/>
      <rect x="2" y="11" width="2" height="2" fill={color}/>
      <rect width="2" height="2" transform="matrix(-1 0 0 1 22 11)" fill={color}/>
    </svg>
  );
}
