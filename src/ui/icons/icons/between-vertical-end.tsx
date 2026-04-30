import React from 'react';
import type { IconProps } from '../types';

export function BetweenVerticalEndIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect width="2" height="12" transform="matrix(1 0 0 -1 2 16)" fill={color}/>
      <rect width="5" height="2" transform="matrix(1 0 0 -1 4 4)" fill={color}/>
      <rect width="5" height="2" transform="matrix(1 0 0 -1 4 18)" fill={color}/>
      <rect width="5" height="2" transform="matrix(1 0 0 -1 15 4)" fill={color}/>
      <rect width="5" height="2" transform="matrix(1 0 0 -1 15 18)" fill={color}/>
      <rect width="2" height="12" transform="matrix(1 0 0 -1 9 16)" fill={color}/>
      <rect width="2" height="12" transform="matrix(1 0 0 -1 20 16)" fill={color}/>
      <rect width="2" height="12" transform="matrix(1 0 0 -1 13 16)" fill={color}/>
      <rect width="2" height="2" transform="matrix(1 0 0 -1 11 20)" fill={color}/>
      <rect width="2" height="2" transform="matrix(1 0 0 -1 9 22)" fill={color}/>
      <rect width="2" height="2" transform="matrix(1 0 0 -1 13 22)" fill={color}/>
    </svg>
  );
}
