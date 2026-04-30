import React from 'react';
import type { IconProps } from '../types';

export function ShieldIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="4" y="2" width="16" height="2" fill={color}/>
      <rect x="2" y="4" width="2" height="10" fill={color}/>
      <rect x="20" y="4" width="2" height="10" fill={color}/>
      <rect x="4" y="14.0001" width="2" height="2" fill={color}/>
      <rect x="6" y="16.0001" width="2" height="2" fill={color}/>
      <rect x="10" y="20" width="4" height="2" fill={color}/>
      <rect width="2" height="2" transform="matrix(-1 0 0 1 20 14.0001)" fill={color}/>
      <rect width="2" height="2" transform="matrix(-1 0 0 1 18 16.0001)" fill={color}/>
      <rect width="2" height="2" transform="matrix(-1 0 0 1 16 18)" fill={color}/>
      <rect width="2" height="2" transform="matrix(-1 0 0 1 10 18)" fill={color}/>
    </svg>
  );
}
