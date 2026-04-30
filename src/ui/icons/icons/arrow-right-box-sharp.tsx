import React from 'react';
import type { IconProps } from '../types';

export function ArrowRightBoxSharpIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="2" y="2" width="20" height="2" fill={color}/>
      <rect x="2" y="20" width="20" height="2" fill={color}/>
      <rect x="2" y="4" width="2" height="16" fill={color}/>
      <rect x="20" y="4" width="2" height="16" fill={color}/>
      <rect width="2" height="2" transform="matrix(-2.3597e-08 1 1 2.3597e-08 16.0669 11.0088)" fill={color}/>
      <rect width="2" height="6" transform="matrix(-2.3597e-08 1 1 2.3597e-08 6.06689 11.0088)" fill={color}/>
      <rect width="6" height="2" transform="matrix(-2.3597e-08 1 1 2.3597e-08 14.0669 9.00885)" fill={color}/>
      <rect width="10" height="2" transform="matrix(-2.3597e-08 1 1 2.3597e-08 12.0669 7.00884)" fill={color}/>
    </svg>
  );
}
