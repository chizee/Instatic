import React from 'react';
import type { IconProps } from '../types';

export function AlignEndVerticalIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect width="2" height="12" transform="matrix(4.37114e-08 1 1 -4.37114e-08 4 3)" fill={color}/>
      <rect width="4" height="2" transform="matrix(4.37114e-08 1 1 -4.37114e-08 16 5)" fill={color}/>
      <rect width="2" height="12" transform="matrix(4.37114e-08 1 1 -4.37114e-08 4 9)" fill={color}/>
      <rect width="4" height="2" transform="matrix(4.37114e-08 1 1 -4.37114e-08 9 15)" fill={color}/>
      <rect width="2" height="5" transform="matrix(4.37114e-08 1 1 -4.37114e-08 11 13)" fill={color}/>
      <rect width="4" height="2" transform="matrix(4.37114e-08 1 1 -4.37114e-08 16 15)" fill={color}/>
      <rect width="2" height="5" transform="matrix(4.37114e-08 1 1 -4.37114e-08 11 19)" fill={color}/>
      <rect width="20" height="2" transform="matrix(4.37114e-08 1 1 -4.37114e-08 20 2)" fill={color}/>
    </svg>
  );
}
