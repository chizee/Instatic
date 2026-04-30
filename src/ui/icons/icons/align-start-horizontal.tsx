import React from 'react';
import type { IconProps } from '../types';

export function AlignStartHorizontalIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect width="4" height="2" transform="matrix(1 0 0 -1 5 22)" fill={color}/>
      <rect width="2" height="12" transform="matrix(1 0 0 -1 3 20)" fill={color}/>
      <rect width="4" height="2" transform="matrix(1 0 0 -1 5 8)" fill={color}/>
      <rect width="2" height="12" transform="matrix(1 0 0 -1 9 20)" fill={color}/>
      <rect width="4" height="2" transform="matrix(1 0 0 -1 15 15)" fill={color}/>
      <rect width="2" height="5" transform="matrix(1 0 0 -1 13 13)" fill={color}/>
      <rect width="4" height="2" transform="matrix(1 0 0 -1 15 8)" fill={color}/>
      <rect width="2" height="5" transform="matrix(1 0 0 -1 19 13)" fill={color}/>
      <rect width="20" height="2" transform="matrix(1 0 0 -1 2 4)" fill={color}/>
    </svg>
  );
}
