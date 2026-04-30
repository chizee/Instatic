import React from 'react';
import type { IconProps } from '../types';

export function SquareChevronDownSharpIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="2" y="20" width="20" height="2" fill={color}/>
      <rect x="2" y="2" width="20" height="2" fill={color}/>
      <rect x="2" y="4" width="2" height="16" fill={color}/>
      <rect x="20" y="4" width="2" height="16" fill={color}/>
      <rect width="2" height="2" transform="matrix(1 0 0 -1 11 15)" fill={color}/>
      <rect width="2" height="2" transform="matrix(1 0 0 -1 9 13)" fill={color}/>
      <rect width="2" height="2" transform="matrix(1 0 0 -1 7 11)" fill={color}/>
      <rect width="2" height="2" transform="matrix(1 0 0 -1 13 13)" fill={color}/>
      <rect width="2" height="2" transform="matrix(1 0 0 -1 15 11)" fill={color}/>
    </svg>
  );
}
