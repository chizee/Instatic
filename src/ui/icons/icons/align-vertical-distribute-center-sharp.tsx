import React from 'react';
import type { IconProps } from '../types';

export function AlignVerticalDistributeCenterSharpIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect width="4" height="2" transform="matrix(-4.37114e-08 -1 -1 4.37114e-08 8 19)" fill={color}/>
      <rect width="4" height="2" transform="matrix(-4.37114e-08 -1 -1 4.37114e-08 10 9)" fill={color}/>
      <rect width="2" height="12" transform="matrix(-6.55671e-08 -1 -1 2.91409e-08 18 15)" fill={color}/>
      <rect width="2" height="8" transform="matrix(-8.74228e-08 -1 -1 2.18557e-08 16 5)" fill={color}/>
      <rect width="4" height="2" transform="matrix(-4.37114e-08 -1 -1 4.37114e-08 18 19)" fill={color}/>
      <rect width="4" height="2" transform="matrix(-4.37114e-08 -1 -1 4.37114e-08 16 9)" fill={color}/>
      <rect width="2" height="12" transform="matrix(-6.55671e-08 -1 -1 2.91409e-08 18 21)" fill={color}/>
      <rect width="2" height="8" transform="matrix(-8.74228e-08 -1 -1 2.18557e-08 16 11)" fill={color}/>
      <rect x="2" y="18" width="2" height="4" transform="rotate(-90 2 18)" fill={color}/>
      <rect x="18" y="18" width="2" height="4" transform="rotate(-90 18 18)" fill={color}/>
      <rect x="16" y="8" width="2" height="6" transform="rotate(-90 16 8)" fill={color}/>
      <rect x="2" y="8" width="2" height="6" transform="rotate(-90 2 8)" fill={color}/>
    </svg>
  );
}
