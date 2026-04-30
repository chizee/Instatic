import React from 'react';
import type { IconProps } from '../types';

export function CornerDownRightIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect width="14" height="2" transform="matrix(1 0 0 -1 6 16)" fill={color}/>
      <rect width="2" height="10" transform="matrix(1 0 0 -1 4 14)" fill={color}/>
      <rect width="2" height="8" transform="matrix(-1 0 0 1 16 10)" fill={color}/>
      <rect width="2" height="2" transform="matrix(-1 0 0 1 18 12)" fill={color}/>
      <rect width="2" height="2" transform="matrix(-1 0 0 1 18 16)" fill={color}/>
      <rect width="2" height="2" transform="matrix(-1 0 0 1 16 18)" fill={color}/>
    </svg>
  );
}
