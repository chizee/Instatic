import React from 'react';
import type { IconProps } from '../types';

export function ClapperboardSharpIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="2" y="3" width="20" height="2" fill={color}/>
      <rect x="4" y="9" width="16" height="2" fill={color}/>
      <rect x="2" y="5" width="2" height="14" fill={color}/>
      <rect x="20" y="5" width="2" height="14" fill={color}/>
      <rect x="2" y="19" width="20" height="2" fill={color}/>
      <rect width="2" height="2" transform="matrix(-1 0 0 1 18 7)" fill={color}/>
      <rect width="2" height="2" transform="matrix(-1 0 0 1 10 7)" fill={color}/>
      <rect width="2" height="2" transform="matrix(-1 0 0 1 16 5)" fill={color}/>
      <rect width="2" height="2" transform="matrix(-1 0 0 1 8 5)" fill={color}/>
    </svg>
  );
}
