import React from 'react';
import type { IconProps } from '../types';

export function PhpIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="2" y="9" width="2" height="8" fill={color}/>
      <rect x="16" y="9" width="2" height="8" fill={color}/>
      <rect width="2" height="8" transform="matrix(1 0 0 -1 9 15)" fill={color}/>
      <rect x="4" y="9" width="2" height="2" fill={color}/>
      <rect x="18" y="9" width="2" height="2" fill={color}/>
      <rect width="2" height="2" transform="matrix(1 0 0 -1 13 15)" fill={color}/>
      <rect x="6" y="10" width="2" height="4" fill={color}/>
      <rect x="20" y="10" width="2" height="4" fill={color}/>
      <rect width="2" height="3" transform="matrix(1 0 0 -1 13 13)" fill={color}/>
      <rect x="4" y="13" width="2" height="2" fill={color}/>
      <rect x="18" y="13" width="2" height="2" fill={color}/>
      <rect width="2" height="2" transform="matrix(1 0 0 -1 11 11)" fill={color}/>
      <rect x="2" y="3" width="20" height="2" fill={color}/>
      <rect x="2" y="19" width="20" height="2" fill={color}/>
    </svg>
  );
}
