import React from 'react';
import type { IconProps } from '../types';

export function PyramidIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="11" y="1" width="2" height="22" fill={color}/>
      <rect x="3" y="15" width="2" height="4" fill={color}/>
      <rect width="2" height="4" transform="matrix(-1 0 0 1 21 15)" fill={color}/>
      <rect x="5" y="11" width="2" height="4" fill={color}/>
      <rect width="2" height="4" transform="matrix(-1 0 0 1 19 11)" fill={color}/>
      <rect x="7" y="7" width="2" height="4" fill={color}/>
      <rect width="2" height="4" transform="matrix(-1 0 0 1 17 7)" fill={color}/>
      <rect x="9" y="3" width="2" height="4" fill={color}/>
      <rect width="2" height="4" transform="matrix(-1 0 0 1 15 3)" fill={color}/>
      <rect x="11" y="21" width="4" height="2" fill={color}/>
      <rect width="4" height="2" transform="matrix(-1 0 0 1 13 21)" fill={color}/>
      <rect x="15" y="19" width="4" height="2" fill={color}/>
      <rect width="4" height="2" transform="matrix(-1 0 0 1 9 19)" fill={color}/>
    </svg>
  );
}
