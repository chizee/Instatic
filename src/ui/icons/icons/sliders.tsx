import React from 'react';
import type { IconProps } from '../types';

export function SlidersIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="17" y="4" width="2" height="10" fill={color}/>
      <rect x="17" y="16" width="2" height="4" fill={color}/>
      <rect x="11" y="10" width="2" height="10" fill={color}/>
      <rect x="5" y="12" width="2" height="8" fill={color}/>
      <rect x="11" y="4" width="2" height="4" fill={color}/>
      <rect x="5" y="4" width="2" height="6" fill={color}/>
      <rect x="2" y="12" width="6" height="2" fill={color}/>
      <rect x="9" y="6" width="6" height="2" fill={color}/>
      <rect x="16" y="16" width="6" height="2" fill={color}/>
    </svg>
  );
}
