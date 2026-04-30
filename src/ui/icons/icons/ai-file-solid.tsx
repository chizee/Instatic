import React from 'react';
import type { IconProps } from '../types';

export function AiFileSolidIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect width="2" height="8" transform="matrix(-1 0 0 1 6 4)" fill={color}/>
      <rect width="10" height="2" transform="matrix(-1 0 0 1 16 2)" fill={color}/>
      <rect width="2" height="14" transform="matrix(-1 0 0 1 20 6)" fill={color}/>
      <rect width="4" height="10" transform="matrix(-1 0 0 1 18 12)" fill={color}/>
      <rect x="16" y="4" width="2" height="2" fill={color}/>
      <rect x="6" y="4" width="8" height="6" fill={color}/>
      <rect x="6" y="8" width="12" height="4" fill={color}/>
      <rect x="2" y="16" width="2" height="6" fill={color}/>
      <rect x="6" y="16" width="2" height="6" fill={color}/>
      <rect x="10" y="14" width="2" height="8" fill={color}/>
      <rect x="4" y="14" width="2" height="2" fill={color}/>
      <rect x="4" y="18" width="2" height="2" fill={color}/>
    </svg>
  );
}
