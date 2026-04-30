import React from 'react';
import type { IconProps } from '../types';

export function CornerLeftDownSharpIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect width="16" height="2" transform="matrix(4.37114e-08 1 1 -4.37114e-08 8 4)" fill={color}/>
      <rect width="2" height="10" transform="matrix(4.37114e-08 1 1 -4.37114e-08 10 4)" fill={color}/>
      <rect width="2" height="2" transform="matrix(-4.37114e-08 -1 -1 4.37114e-08 14 16)" fill={color}/>
      <rect width="2" height="2" transform="matrix(-4.37114e-08 -1 -1 4.37114e-08 12 18)" fill={color}/>
      <rect width="2" height="2" transform="matrix(-4.37114e-08 -1 -1 4.37114e-08 8 18)" fill={color}/>
      <rect width="2" height="10" transform="matrix(-4.37114e-08 -1 -1 4.37114e-08 14 16)" fill={color}/>
    </svg>
  );
}
