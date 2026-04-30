import React from 'react';
import type { IconProps } from '../types';

export function SlidersVerticalIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect width="2" height="6" transform="matrix(4.37114e-08 1 1 -4.37114e-08 2 13)" fill={color}/>
      <rect width="7" height="2" transform="matrix(4.37114e-08 1 1 -4.37114e-08 4 15)" fill={color}/>
      <rect width="9" height="2" transform="matrix(4.37114e-08 1 1 -4.37114e-08 4 2)" fill={color}/>
      <rect width="11" height="2" transform="matrix(4.37114e-08 1 1 -4.37114e-08 18 2)" fill={color}/>
      <rect width="2" height="6" transform="matrix(4.37114e-08 1 1 -4.37114e-08 16 15)" fill={color}/>
      <rect width="5" height="2" transform="matrix(4.37114e-08 1 1 -4.37114e-08 18 17)" fill={color}/>
      <rect width="11" height="2" transform="matrix(4.37114e-08 1 1 -4.37114e-08 11 11)" fill={color}/>
      <rect width="2" height="6" transform="matrix(4.37114e-08 1 1 -4.37114e-08 9 7)" fill={color}/>
      <rect width="5" height="2" transform="matrix(4.37114e-08 1 1 -4.37114e-08 11 2)" fill={color}/>
    </svg>
  );
}
