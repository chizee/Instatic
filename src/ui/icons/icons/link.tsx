import React from 'react';
import type { IconProps } from '../types';

export function LinkIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="4" y="6" width="7" height="2" fill={color}/>
      <rect x="4" y="16" width="7" height="2" fill={color}/>
      <rect x="2" y="8" width="2" height="8" fill={color}/>
      <rect width="7" height="2" transform="matrix(-1 0 0 1 20 6)" fill={color}/>
      <rect width="7" height="2" transform="matrix(-1 0 0 1 20 16)" fill={color}/>
      <rect width="2" height="8" transform="matrix(-1 0 0 1 22 8)" fill={color}/>
      <rect x="7" y="11" width="10" height="2" fill={color}/>
    </svg>
  );
}
