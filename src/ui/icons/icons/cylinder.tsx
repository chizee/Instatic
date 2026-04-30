import React from 'react';
import type { IconProps } from '../types';

export function CylinderIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="2" y="5" width="2" height="4" fill={color}/>
      <rect x="2" y="9" width="2" height="4" fill={color}/>
      <rect x="2" y="13" width="2" height="6" fill={color}/>
      <rect x="20" y="5" width="2" height="4" fill={color}/>
      <rect x="20" y="9" width="2" height="4" fill={color}/>
      <rect x="20" y="13" width="2" height="6" fill={color}/>
      <rect x="4" y="3" width="4" height="2" fill={color}/>
      <rect width="4" height="2" transform="matrix(1 0 0 -1 4 11)" fill={color}/>
      <rect width="4" height="2" transform="matrix(1 0 0 -1 4 21)" fill={color}/>
      <rect x="16" y="3" width="4" height="2" fill={color}/>
      <rect width="4" height="2" transform="matrix(1 0 0 -1 16 11)" fill={color}/>
      <rect width="4" height="2" transform="matrix(1 0 0 -1 16 21)" fill={color}/>
      <rect x="8" y="1" width="8" height="2" fill={color}/>
      <rect width="8" height="2" transform="matrix(1 0 0 -1 8 13)" fill={color}/>
      <rect width="8" height="2" transform="matrix(1 0 0 -1 8 23)" fill={color}/>
    </svg>
  );
}
