import React from 'react';
import type { IconProps } from '../types';

export function FountainSharpIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="2" y="14" width="20" height="2" fill={color}/>
      <rect x="2" y="16" width="2" height="4" fill={color}/>
      <rect x="2" y="20" width="20" height="2" fill={color}/>
      <rect x="20" y="16" width="2" height="4" fill={color}/>
      <rect x="3" y="10" width="2" height="2" fill={color}/>
      <rect width="2" height="2" transform="matrix(-1 0 0 1 21 10)" fill={color}/>
      <rect x="3" y="8" width="6" height="2" fill={color}/>
      <rect width="6" height="2" transform="matrix(-1 0 0 1 21 8)" fill={color}/>
      <rect x="7" y="10" width="2" height="4" fill={color}/>
      <rect width="2" height="4" transform="matrix(-1 0 0 1 17 10)" fill={color}/>
      <rect x="11" y="2" width="2" height="12" fill={color}/>
      <rect x="5" y="2" width="6" height="2" fill={color}/>
      <rect x="3" y="2" width="2" height="4" fill={color}/>
      <rect x="13" y="2" width="6" height="2" fill={color}/>
      <rect x="19" y="2" width="2" height="4" fill={color}/>
    </svg>
  );
}
