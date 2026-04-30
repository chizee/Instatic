import React from 'react';
import type { IconProps } from '../types';

export function SquareChevronsHorizontalIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="4" y="20" width="16" height="2" fill={color}/>
      <rect x="4" y="2" width="16" height="2" fill={color}/>
      <rect x="2" y="4" width="2" height="16" fill={color}/>
      <rect x="20" y="4" width="2" height="16" fill={color}/>
      <rect width="2" height="2" transform="matrix(-4.37114e-08 1 1 4.37114e-08 6 11)" fill={color}/>
      <rect x="18" y="11" width="2" height="2" transform="rotate(90 18 11)" fill={color}/>
      <rect width="2" height="2" transform="matrix(-4.37114e-08 1 1 4.37114e-08 8 9)" fill={color}/>
      <rect x="16" y="9" width="2" height="2" transform="rotate(90 16 9)" fill={color}/>
      <rect width="2" height="2" transform="matrix(-4.37114e-08 1 1 4.37114e-08 8 13)" fill={color}/>
      <rect x="16" y="13" width="2" height="2" transform="rotate(90 16 13)" fill={color}/>
    </svg>
  );
}
