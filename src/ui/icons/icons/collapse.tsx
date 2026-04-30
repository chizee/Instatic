import React from 'react';
import type { IconProps } from '../types';

export function CollapseIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect width="16" height="2" transform="matrix(1 0 0 -1 4 13)" fill={color}/>
      <rect x="11" y="7" width="2" height="2" fill={color}/>
      <rect x="9" y="5" width="4" height="2" fill={color}/>
      <rect x="13" y="5" width="2" height="2" fill={color}/>
      <rect x="15" y="3" width="2" height="2" fill={color}/>
      <rect x="7" y="3" width="8" height="2" fill={color}/>
      <rect width="2" height="2" transform="matrix(1 0 0 -1 11 17)" fill={color}/>
      <rect width="4" height="2" transform="matrix(1 0 0 -1 9 19)" fill={color}/>
      <rect width="2" height="2" transform="matrix(1 0 0 -1 13 19)" fill={color}/>
      <rect width="2" height="2" transform="matrix(1 0 0 -1 15 21)" fill={color}/>
      <rect width="8" height="2" transform="matrix(1 0 0 -1 7 21)" fill={color}/>
    </svg>
  );
}
