import React from 'react';
import type { IconProps } from '../types';

export function ReloadIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="16" y="4" width="2" height="6" fill={color}/>
      <rect x="14" y="2" width="2" height="2" fill={color}/>
      <rect x="14" y="4" width="2" height="8" fill={color}/>
      <rect width="2" height="5" transform="matrix(-1 0 0 1 4 8)" fill={color}/>
      <rect x="4" y="6" width="16" height="2" fill={color}/>
      <rect x="8" y="20" width="2" height="6" transform="rotate(180 8 20)" fill={color}/>
      <rect x="10" y="22" width="2" height="2" transform="rotate(180 10 22)" fill={color}/>
      <rect x="10" y="20" width="2" height="8" transform="rotate(180 10 20)" fill={color}/>
      <rect width="2" height="5" transform="matrix(1 0 0 -1 20 16)" fill={color}/>
      <rect x="20" y="18" width="16" height="2" transform="rotate(180 20 18)" fill={color}/>
    </svg>
  );
}
