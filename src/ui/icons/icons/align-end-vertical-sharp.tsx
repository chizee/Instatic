import React from 'react';
import type { IconProps } from '../types';

export function AlignEndVerticalSharpIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect width="4" height="2" transform="matrix(4.37114e-08 1 1 -4.37114e-08 2 5)" fill={color}/>
      <rect width="2" height="16" transform="matrix(5.82819e-08 1 1 -3.27835e-08 2 3)" fill={color}/>
      <rect width="4" height="2" transform="matrix(4.37114e-08 1 1 -4.37114e-08 16 5)" fill={color}/>
      <rect width="2" height="16" transform="matrix(5.82819e-08 1 1 -3.27835e-08 2 9)" fill={color}/>
      <rect width="4" height="2" transform="matrix(4.37114e-08 1 1 -4.37114e-08 9 15)" fill={color}/>
      <rect width="2" height="9" transform="matrix(7.86805e-08 1 1 -2.42841e-08 9 13)" fill={color}/>
      <rect width="4" height="2" transform="matrix(4.37114e-08 1 1 -4.37114e-08 16 15)" fill={color}/>
      <rect width="2" height="9" transform="matrix(7.86805e-08 1 1 -2.42841e-08 9 19)" fill={color}/>
      <rect width="20" height="2" transform="matrix(4.37114e-08 1 1 -4.37114e-08 20 2)" fill={color}/>
    </svg>
  );
}
