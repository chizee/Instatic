import React from 'react';
import type { IconProps } from '../types';

export function ArrowBarRightIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect width="16" height="2" transform="matrix(4.37114e-08 1 1 -4.37114e-08 20 4)" fill={color}/>
      <rect width="2" height="16" transform="matrix(4.37114e-08 1 1 -4.37114e-08 2 11)" fill={color}/>
      <rect width="2" height="2" transform="matrix(4.37114e-08 1 1 -4.37114e-08 14 13)" fill={color}/>
      <rect width="2" height="2" transform="matrix(4.37114e-08 1 1 -4.37114e-08 12 15)" fill={color}/>
      <rect width="2" height="2" transform="matrix(4.37114e-08 1 1 -4.37114e-08 10 17)" fill={color}/>
      <rect width="2" height="2" transform="matrix(4.37114e-08 1 1 -4.37114e-08 14 9)" fill={color}/>
      <rect width="2" height="2" transform="matrix(4.37114e-08 1 1 -4.37114e-08 12 7)" fill={color}/>
      <rect width="2" height="2" transform="matrix(4.37114e-08 1 1 -4.37114e-08 10 5)" fill={color}/>
    </svg>
  );
}
