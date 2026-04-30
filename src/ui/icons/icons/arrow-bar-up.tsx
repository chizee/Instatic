import React from 'react';
import type { IconProps } from '../types';

export function ArrowBarUpIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect width="16" height="2" transform="matrix(1 0 0 -1 4 4)" fill={color}/>
      <rect width="2" height="16" transform="matrix(1 0 0 -1 11 22)" fill={color}/>
      <rect width="2" height="2" transform="matrix(1 0 0 -1 13 10)" fill={color}/>
      <rect width="2" height="2" transform="matrix(1 0 0 -1 15 12)" fill={color}/>
      <rect width="2" height="2" transform="matrix(1 0 0 -1 17 14)" fill={color}/>
      <rect width="2" height="2" transform="matrix(1 0 0 -1 9 10)" fill={color}/>
      <rect width="2" height="2" transform="matrix(1 0 0 -1 7 12)" fill={color}/>
      <rect width="2" height="2" transform="matrix(1 0 0 -1 5 14)" fill={color}/>
    </svg>
  );
}
