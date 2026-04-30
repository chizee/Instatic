import React from 'react';
import type { IconProps } from '../types';

export function GroupIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="16" y="2" width="4" height="2" fill={color}/>
      <rect width="4" height="2" transform="matrix(1 0 0 -1 16 22)" fill={color}/>
      <rect width="4" height="2" transform="matrix(-1 0 0 1 8 2)" fill={color}/>
      <rect x="8" y="22" width="4" height="2" transform="rotate(180 8 22)" fill={color}/>
      <rect x="20" y="4" width="2" height="4" fill={color}/>
      <rect width="2" height="4" transform="matrix(1 0 0 -1 20 20)" fill={color}/>
      <rect width="2" height="4" transform="matrix(-1 0 0 1 4 4)" fill={color}/>
      <rect x="4" y="20" width="2" height="4" transform="rotate(180 4 20)" fill={color}/>
      <rect x="6" y="6" width="6" height="2" fill={color}/>
      <rect x="6" y="8" width="2" height="3" fill={color}/>
      <rect x="8" y="11" width="8" height="2" fill={color}/>
      <rect x="16" y="13" width="2" height="3" fill={color}/>
      <rect x="12" y="16" width="6" height="2" fill={color}/>
      <rect x="10" y="13" width="2" height="3" fill={color}/>
      <rect x="12" y="8" width="2" height="3" fill={color}/>
    </svg>
  );
}
