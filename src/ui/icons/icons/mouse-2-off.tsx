import React from 'react';
import type { IconProps } from '../types';

export function Mouse2OffIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="8" y="2" width="8" height="2" fill={color}/>
      <rect width="8" height="2" transform="matrix(1 0 0 -1 8 22)" fill={color}/>
      <rect width="2" height="2" transform="matrix(1 0 0 -1 6 20)" fill={color}/>
      <rect x="16" y="4" width="2" height="2" fill={color}/>
      <rect width="2" height="2" transform="matrix(1 0 0 -1 16 20)" fill={color}/>
      <rect x="4" y="6" width="2" height="12" fill={color}/>
      <rect x="18" y="6" width="2" height="8" fill={color}/>
      <rect x="11" y="4" width="2" height="4" fill={color}/>
      <rect x="6" y="10" width="6" height="2" fill={color}/>
      <rect x="16" y="10" width="4" height="2" fill={color}/>
      <rect width="2" height="2" transform="matrix(1 0 0 -1 6 8)" fill={color}/>
      <rect width="2" height="2" transform="matrix(1 0 0 -1 4 6)" fill={color}/>
      <rect width="2" height="2" transform="matrix(1 0 0 -1 2 4)" fill={color}/>
      <rect width="2" height="2" transform="matrix(1 0 0 -1 8 10)" fill={color}/>
      <rect width="2" height="2" transform="matrix(1 0 0 -1 10 12)" fill={color}/>
      <rect width="2" height="2" transform="matrix(1 0 0 -1 12 14)" fill={color}/>
      <rect width="2" height="2" transform="matrix(1 0 0 -1 14 16)" fill={color}/>
      <rect width="2" height="2" transform="matrix(1 0 0 -1 16 18)" fill={color}/>
      <rect width="2" height="2" transform="matrix(1 0 0 -1 18 20)" fill={color}/>
      <rect width="2" height="2" transform="matrix(1 0 0 -1 20 22)" fill={color}/>
    </svg>
  );
}
