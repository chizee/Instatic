import React from 'react';
import type { IconProps } from '../types';

export function AArrowUpIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect width="2" height="12" transform="matrix(1 0 0 -1 16 18)" fill={color}/>
      <rect width="2" height="2" transform="matrix(1 0 0 -1 18 10)" fill={color}/>
      <rect width="2" height="2" transform="matrix(1 0 0 -1 14 10)" fill={color}/>
      <rect width="4" height="2" transform="matrix(1 0 0 -1 18 12)" fill={color}/>
      <rect width="4" height="2" transform="matrix(1 0 0 -1 12 12)" fill={color}/>
      <rect x="2" y="8" width="2" height="10" fill={color}/>
      <rect x="8" y="8" width="2" height="10" fill={color}/>
      <rect x="4" y="12" width="6" height="2" fill={color}/>
      <rect x="4" y="6" width="4" height="2" fill={color}/>
    </svg>
  );
}
