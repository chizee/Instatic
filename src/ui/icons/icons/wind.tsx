import React from 'react';
import type { IconProps } from '../types';

export function WindIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="2" y="7" width="10" height="2" fill={color}/>
      <rect x="12" y="3" width="2" height="4" fill={color}/>
      <rect x="7" y="1" width="5" height="2" fill={color}/>
      <rect x="2" y="11" width="18" height="2" fill={color}/>
      <rect x="20" y="7" width="2" height="4" fill={color}/>
      <rect x="16" y="5" width="4" height="2" fill={color}/>
      <rect width="12" height="2" transform="matrix(1 0 0 -1 2 17)" fill={color}/>
      <rect width="2" height="2" transform="matrix(1 0 0 -1 14 19)" fill={color}/>
      <rect width="5" height="2" transform="matrix(1 0 0 -1 9 21)" fill={color}/>
    </svg>
  );
}
