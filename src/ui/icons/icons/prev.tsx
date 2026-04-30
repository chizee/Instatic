import React from 'react';
import type { IconProps } from '../types';

export function PrevIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect width="2" height="16" transform="matrix(-1 0 0 1 8 4)" fill={color}/>
      <rect width="2" height="2" transform="matrix(-1 0 0 1 14 9)" fill={color}/>
      <rect width="2" height="2" transform="matrix(-1 0 0 1 14 13)" fill={color}/>
      <rect width="2" height="2" transform="matrix(-1 0 0 1 16 7)" fill={color}/>
      <rect width="2" height="14" transform="matrix(-1 0 0 1 18 5)" fill={color}/>
      <rect width="2" height="2" transform="matrix(-1 0 0 1 12 11)" fill={color}/>
      <rect x="14" y="15" width="2" height="2" fill={color}/>
    </svg>
  );
}
