import React from 'react';
import type { IconProps } from '../types';

export function MessageRightIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect width="16" height="2" transform="matrix(-1 0 0 1 20 2)" fill={color}/>
      <rect width="6" height="2" transform="matrix(-1 0 0 1 12 16)" fill={color}/>
      <rect width="2" height="6" transform="matrix(-1 0 0 1 22 4)" fill={color}/>
      <rect width="2" height="18" transform="matrix(-1 0 0 1 4 4)" fill={color}/>
      <rect width="2" height="2" transform="matrix(-1 0 0 1 6 18)" fill={color}/>
      <rect x="22" y="16" width="2" height="2" fill={color}/>
      <rect x="14" y="16" width="4" height="2" fill={color}/>
      <rect x="20" y="14" width="2" height="6" fill={color}/>
      <rect x="18" y="12" width="2" height="10" fill={color}/>
    </svg>
  );
}
