import React from 'react';
import type { IconProps } from '../types';

export function FigmaIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="5" y="4" width="2" height="4" fill={color}/>
      <rect width="2" height="4" transform="matrix(-1 0 0 1 19 4)" fill={color}/>
      <rect width="2" height="4" transform="matrix(-1 0 0 1 19 10)" fill={color}/>
      <rect x="5" y="10" width="2" height="4" fill={color}/>
      <rect x="5" y="16" width="2" height="4" fill={color}/>
      <rect x="7" y="2" width="4" height="2" fill={color}/>
      <rect width="4" height="2" transform="matrix(-1 0 0 1 17 2)" fill={color}/>
      <rect width="4" height="2" transform="matrix(-1 0 0 1 17 8)" fill={color}/>
      <rect x="7" y="8" width="4" height="2" fill={color}/>
      <rect width="4" height="2" transform="matrix(-1 0 0 1 17 14)" fill={color}/>
      <rect x="7" y="14" width="4" height="2" fill={color}/>
      <rect x="7" y="20" width="4" height="2" fill={color}/>
      <rect x="11" y="2" width="2" height="8" fill={color}/>
      <rect x="11" y="8" width="2" height="8" fill={color}/>
      <rect x="11" y="14" width="2" height="6" fill={color}/>
    </svg>
  );
}
