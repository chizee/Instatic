import React from 'react';
import type { IconProps } from '../types';

export function CopyleftIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="2" y="6" width="2" height="12" fill={color}/>
      <rect x="6" y="20" width="12" height="2" fill={color}/>
      <rect x="20" y="6" width="2" height="12" fill={color}/>
      <rect x="6" y="2" width="12" height="2" fill={color}/>
      <rect x="4" y="4" width="2" height="2" fill={color}/>
      <rect x="4" y="18" width="2" height="2" fill={color}/>
      <rect x="18" y="4" width="2" height="2" fill={color}/>
      <rect x="18" y="18" width="2" height="2" fill={color}/>
      <rect width="4" height="2" transform="matrix(-1 0 0 1 14 7)" fill={color}/>
      <rect width="2" height="2" transform="matrix(-1 0 0 1 10 9)" fill={color}/>
      <rect width="2" height="6" transform="matrix(-1 0 0 1 16 9)" fill={color}/>
      <rect width="4" height="2" transform="matrix(-1 0 0 1 14 15)" fill={color}/>
      <rect width="2" height="2" transform="matrix(-1 0 0 1 10 13)" fill={color}/>
    </svg>
  );
}
