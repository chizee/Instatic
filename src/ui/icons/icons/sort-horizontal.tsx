import React from 'react';
import type { IconProps } from '../types';

export function SortHorizontalIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="20" y="16" width="2" height="16" transform="rotate(90 20 16)" fill={color}/>
      <rect x="10" y="14" width="2" height="4" transform="rotate(90 10 14)" fill={color}/>
      <rect x="10" y="12" width="2" height="2" transform="rotate(90 10 12)" fill={color}/>
      <rect x="10" y="18" width="2" height="4" transform="rotate(90 10 18)" fill={color}/>
      <rect x="10" y="20" width="2" height="2" transform="rotate(90 10 20)" fill={color}/>
      <rect width="2" height="16" transform="matrix(-4.37114e-08 1 1 4.37114e-08 4 6)" fill={color}/>
      <rect width="2" height="4" transform="matrix(-4.37114e-08 1 1 4.37114e-08 14 4)" fill={color}/>
      <rect width="2" height="2" transform="matrix(-4.37114e-08 1 1 4.37114e-08 14 2)" fill={color}/>
      <rect width="2" height="4" transform="matrix(-4.37114e-08 1 1 4.37114e-08 14 8)" fill={color}/>
      <rect width="2" height="2" transform="matrix(-4.37114e-08 1 1 4.37114e-08 14 10)" fill={color}/>
    </svg>
  );
}
