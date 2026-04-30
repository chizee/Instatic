import React from 'react';
import type { IconProps } from '../types';

export function ButterflyIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="9" y="3" width="2" height="2" fill={color}/>
      <rect x="13" y="3" width="2" height="2" fill={color}/>
      <rect x="11" y="5" width="2" height="14" fill={color}/>
      <rect x="13" y="9" width="2" height="2" fill={color}/>
      <rect width="2" height="2" transform="matrix(-1 0 0 1 11 9)" fill={color}/>
      <rect x="15" y="7" width="2" height="2" fill={color}/>
      <rect width="2" height="2" transform="matrix(-1 0 0 1 9 7)" fill={color}/>
      <rect x="17" y="5" width="5" height="2" fill={color}/>
      <rect width="5" height="2" transform="matrix(-1 0 0 1 7 5)" fill={color}/>
      <rect x="22" y="7" width="2" height="4" fill={color}/>
      <rect width="2" height="4" transform="matrix(-1 0 0 1 2 7)" fill={color}/>
      <rect x="20" y="11" width="2" height="2" fill={color}/>
      <rect width="2" height="2" transform="matrix(-1 0 0 1 4 11)" fill={color}/>
      <rect x="14" y="13" width="6" height="2" fill={color}/>
      <rect width="6" height="2" transform="matrix(-1 0 0 1 10 13)" fill={color}/>
      <rect x="16" y="13" width="2" height="6" fill={color}/>
      <rect width="2" height="6" transform="matrix(-1 0 0 1 8 13)" fill={color}/>
      <rect x="13" y="19" width="3" height="2" fill={color}/>
      <rect width="3" height="2" transform="matrix(-1 0 0 1 11 19)" fill={color}/>
    </svg>
  );
}
