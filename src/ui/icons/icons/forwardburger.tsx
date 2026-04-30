import React from 'react';
import type { IconProps } from '../types';

export function ForwardburgerIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect width="8" height="2" transform="matrix(-1 0 0 1 12 7)" fill={color}/>
      <rect width="16" height="2" transform="matrix(-1 0 0 1 20 11)" fill={color}/>
      <rect width="8" height="2" transform="matrix(-1 0 0 1 12 15)" fill={color}/>
      <rect width="2" height="2" transform="matrix(-1 0 0 1 18 9)" fill={color}/>
      <rect width="2" height="8" transform="matrix(-1 0 0 1 16 7)" fill={color}/>
      <rect width="2" height="2" transform="matrix(-1 0 0 1 18 13)" fill={color}/>
      <rect width="2" height="2" transform="matrix(-1 0 0 1 16 15)" fill={color}/>
    </svg>
  );
}
