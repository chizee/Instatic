import React from 'react';
import type { IconProps } from '../types';

export function AlignVerticalJustifyStartIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect width="20" height="2" transform="matrix(1 0 0 -1 2 4)" fill={color}/>
      <rect width="3" height="2" transform="matrix(-4.37114e-08 1 1 4.37114e-08 7 8)" fill={color}/>
      <rect width="2" height="6" transform="matrix(-4.37114e-08 1 1 4.37114e-08 9 6)" fill={color}/>
      <rect width="3" height="2" transform="matrix(-4.37114e-08 1 1 4.37114e-08 15 8)" fill={color}/>
      <rect width="2" height="6" transform="matrix(-4.37114e-08 1 1 4.37114e-08 9 11)" fill={color}/>
      <rect width="3" height="2" transform="matrix(-4.37114e-08 1 1 4.37114e-08 4 17)" fill={color}/>
      <rect width="2" height="12" transform="matrix(-4.37114e-08 1 1 4.37114e-08 6 15)" fill={color}/>
      <rect width="3" height="2" transform="matrix(-4.37114e-08 1 1 4.37114e-08 18 17)" fill={color}/>
      <rect width="2" height="12" transform="matrix(-4.37114e-08 1 1 4.37114e-08 6 20)" fill={color}/>
    </svg>
  );
}
