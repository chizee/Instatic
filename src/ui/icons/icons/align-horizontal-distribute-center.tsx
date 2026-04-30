import React from 'react';
import type { IconProps } from '../types';

export function AlignHorizontalDistributeCenterIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect width="4" height="2" transform="matrix(1 0 0 -1 5 8)" fill={color}/>
      <rect width="4" height="2" transform="matrix(1 0 0 -1 15 10)" fill={color}/>
      <rect width="2" height="8" transform="matrix(1 0 0 -1 9 16)" fill={color}/>
      <rect width="2" height="4" transform="matrix(1 0 0 -1 19 14)" fill={color}/>
      <rect width="4" height="2" transform="matrix(1 0 0 -1 5 18)" fill={color}/>
      <rect width="4" height="2" transform="matrix(1 0 0 -1 15 16)" fill={color}/>
      <rect width="2" height="8" transform="matrix(1 0 0 -1 3 16)" fill={color}/>
      <rect width="2" height="4" transform="matrix(1 0 0 -1 13 14)" fill={color}/>
      <rect x="6" y="2" width="2" height="4" fill={color}/>
      <rect x="6" y="18" width="2" height="4" fill={color}/>
      <rect x="16" y="16" width="2" height="6" fill={color}/>
      <rect x="16" y="2" width="2" height="6" fill={color}/>
    </svg>
  );
}
