import React from 'react';
import type { IconProps } from '../types';

export function Fire3Icon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="10" y="2" width="2" height="2" fill={color}/>
      <rect x="8" y="4" width="2" height="2" fill={color}/>
      <rect width="2" height="2" transform="matrix(-1 0 0 1 14 4)" fill={color}/>
      <rect x="4" y="8" width="2" height="4" fill={color}/>
      <rect width="2" height="4" transform="matrix(-1 0 0 1 18 8)" fill={color}/>
      <rect x="2" y="12" width="2" height="6" fill={color}/>
      <rect width="2" height="6" transform="matrix(-1 0 0 1 20 12)" fill={color}/>
      <rect x="6" y="20" width="10" height="2" fill={color}/>
      <rect x="6" y="6" width="2" height="2" fill={color}/>
      <rect x="14" y="6" width="2" height="2" fill={color}/>
      <rect x="4" y="18" width="2" height="2" fill={color}/>
      <rect x="16" y="18" width="2" height="2" fill={color}/>
      <rect x="6" y="16" width="2" height="2" fill={color}/>
      <rect x="8" y="14" width="2" height="2" fill={color}/>
      <rect x="10" y="12" width="2" height="2" fill={color}/>
      <rect x="12" y="14" width="2" height="2" fill={color}/>
      <rect x="14" y="16" width="2" height="2" fill={color}/>
    </svg>
  );
}
