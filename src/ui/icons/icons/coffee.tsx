import React from 'react';
import type { IconProps } from '../types';

export function CoffeeIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="4" y="4" width="16" height="2" fill={color}/>
      <rect x="4" y="6" width="2" height="8" fill={color}/>
      <rect x="6" y="14" width="10" height="2" fill={color}/>
      <rect x="20" y="6" width="2" height="4" fill={color}/>
      <rect x="18" y="10" width="2" height="2" fill={color}/>
      <rect x="16" y="6" width="2" height="8" fill={color}/>
      <rect x="2" y="18" width="18" height="2" fill={color}/>
    </svg>
  );
}
