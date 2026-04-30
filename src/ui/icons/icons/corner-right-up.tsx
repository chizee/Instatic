import React from 'react';
import type { IconProps } from '../types';

export function CornerRightUpIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect width="14" height="2" transform="matrix(-4.37114e-08 -1 -1 4.37114e-08 16 18)" fill={color}/>
      <rect width="2" height="10" transform="matrix(-4.37114e-08 -1 -1 4.37114e-08 14 20)" fill={color}/>
      <rect width="2" height="8" transform="matrix(4.37114e-08 1 1 -4.37114e-08 10 8)" fill={color}/>
      <rect width="2" height="2" transform="matrix(4.37114e-08 1 1 -4.37114e-08 12 6)" fill={color}/>
      <rect width="2" height="2" transform="matrix(4.37114e-08 1 1 -4.37114e-08 16 6)" fill={color}/>
      <rect width="2" height="2" transform="matrix(4.37114e-08 1 1 -4.37114e-08 18 8)" fill={color}/>
    </svg>
  );
}
