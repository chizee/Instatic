import React from 'react';
import type { IconProps } from '../types';

export function CalendarSortDescendingSharpIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="1" y="6" width="14" height="2" fill={color}/>
      <rect x="1" y="8" width="2" height="10" fill={color}/>
      <rect x="1" y="18" width="10" height="2" fill={color}/>
      <rect x="13" y="8" width="2" height="4" fill={color}/>
      <rect x="3" y="10" width="10" height="2" fill={color}/>
      <rect x="3" y="4" width="2" height="2" fill={color}/>
      <rect x="11" y="4" width="2" height="2" fill={color}/>
      <rect width="8" height="2" transform="matrix(1 0 0 -1 13 18)" fill={color}/>
      <rect width="2" height="2" transform="matrix(1 0 0 -1 15 16)" fill={color}/>
      <rect width="2" height="2" transform="matrix(1 0 0 -1 19 16)" fill={color}/>
      <rect width="2" height="2" transform="matrix(1 0 0 -1 21 18)" fill={color}/>
      <rect width="2" height="10" transform="matrix(1 0 0 -1 17 22)" fill={color}/>
    </svg>
  );
}
