import React from 'react';
import type { IconProps } from '../types';

export function BetweenHorizontalStartIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect width="2" height="12" transform="matrix(4.37114e-08 1 1 -4.37114e-08 8 2)" fill={color}/>
      <rect width="5" height="2" transform="matrix(4.37114e-08 1 1 -4.37114e-08 20 4)" fill={color}/>
      <rect width="5" height="2" transform="matrix(4.37114e-08 1 1 -4.37114e-08 6 4)" fill={color}/>
      <rect width="5" height="2" transform="matrix(4.37114e-08 1 1 -4.37114e-08 20 15)" fill={color}/>
      <rect width="5" height="2" transform="matrix(4.37114e-08 1 1 -4.37114e-08 6 15)" fill={color}/>
      <rect width="2" height="12" transform="matrix(4.37114e-08 1 1 -4.37114e-08 8 9)" fill={color}/>
      <rect width="2" height="12" transform="matrix(4.37114e-08 1 1 -4.37114e-08 8 20)" fill={color}/>
      <rect width="2" height="12" transform="matrix(4.37114e-08 1 1 -4.37114e-08 8 13)" fill={color}/>
      <rect width="2" height="2" transform="matrix(4.37114e-08 1 1 -4.37114e-08 4 11)" fill={color}/>
      <rect width="2" height="2" transform="matrix(4.37114e-08 1 1 -4.37114e-08 2 9)" fill={color}/>
      <rect width="2" height="2" transform="matrix(4.37114e-08 1 1 -4.37114e-08 2 13)" fill={color}/>
    </svg>
  );
}
