import React from 'react';
import type { IconProps } from '../types';

export function Notes2Icon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect width="12" height="2" transform="matrix(-1 0 0 1 20 2)" fill={color}/>
      <rect width="8" height="2" transform="matrix(-1 0 0 1 18 6)" fill={color}/>
      <rect width="4" height="2" transform="matrix(-1 0 0 1 14 10)" fill={color}/>
      <rect width="12" height="2" transform="matrix(-1 0 0 1 20 16)" fill={color}/>
      <rect width="12" height="2" transform="matrix(-1 0 0 1 16 20)" fill={color}/>
      <rect width="2" height="12" transform="matrix(-1 0 0 1 22 4)" fill={color}/>
      <rect width="2" height="12" transform="matrix(-1 0 0 1 8 4)" fill={color}/>
      <rect width="2" height="12" transform="matrix(-1 0 0 1 4 8)" fill={color}/>
      <rect width="2" height="2" transform="matrix(-1 0 0 1 6 6)" fill={color}/>
      <rect width="2" height="2" transform="matrix(-1 0 0 1 18 18)" fill={color}/>
    </svg>
  );
}
