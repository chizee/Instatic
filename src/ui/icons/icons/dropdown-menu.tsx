import React from 'react';
import type { IconProps } from '../types';

export function DropdownMenuIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect width="2" height="16" transform="matrix(1 0 0 -1 20 20)" fill={color}/>
      <rect width="16" height="2" transform="matrix(1 0 0 -1 4 22)" fill={color}/>
      <rect width="2" height="16" transform="matrix(1 0 0 -1 2 20)" fill={color}/>
      <rect width="16" height="2" transform="matrix(1 0 0 -1 4 4)" fill={color}/>
      <rect x="4" y="8" width="16" height="2" fill={color}/>
      <rect x="17" y="5" width="2" height="2" fill={color}/>
      <rect x="6" y="12" width="11" height="2" fill={color}/>
      <rect x="6" y="16" width="7" height="2" fill={color}/>
    </svg>
  );
}
