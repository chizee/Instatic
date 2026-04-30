import React from 'react';
import type { IconProps } from '../types';

export function FilePlusSharpIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect width="2" height="10" transform="matrix(-1 0 0 1 6 4)" fill={color}/>
      <rect width="12" height="2" transform="matrix(-1 0 0 1 16 2)" fill={color}/>
      <rect width="2" height="14" transform="matrix(-1 0 0 1 20 6)" fill={color}/>
      <rect width="8" height="2" transform="matrix(-1 0 0 1 20 20)" fill={color}/>
      <rect x="16" y="4" width="2" height="2" fill={color}/>
      <rect x="12" y="4" width="2" height="6" fill={color}/>
      <rect x="12" y="8" width="6" height="2" fill={color}/>
      <rect x="4" y="18" width="6" height="2" fill={color}/>
      <rect x="6" y="16" width="2" height="6" fill={color}/>
    </svg>
  );
}
