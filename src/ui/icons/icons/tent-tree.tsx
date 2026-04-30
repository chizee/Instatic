import React from 'react';
import type { IconProps } from '../types';

export function TentTreeIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="1" y="21" width="22" height="2" fill={color}/>
      <rect x="1" y="17" width="2" height="4" fill={color}/>
      <rect x="21" y="17" width="2" height="4" fill={color}/>
      <rect x="3" y="13" width="2" height="4" fill={color}/>
      <rect x="11" y="13" width="2" height="4" fill={color}/>
      <rect x="19" y="13" width="2" height="4" fill={color}/>
      <rect x="5" y="11" width="14" height="2" fill={color}/>
      <rect x="17" y="1" width="2" height="12" fill={color}/>
      <rect width="2" height="2" transform="matrix(-1 0 0 1 21 9)" fill={color}/>
      <rect width="2" height="2" transform="matrix(-1 0 0 1 17 9)" fill={color}/>
      <rect x="15" y="3" width="2" height="2" fill={color}/>
      <rect width="2" height="2" transform="matrix(-1 0 0 1 21 3)" fill={color}/>
      <rect x="13" y="5" width="2" height="2" fill={color}/>
      <rect width="2" height="2" transform="matrix(-1 0 0 1 23 5)" fill={color}/>
      <rect x="7" y="13" width="2" height="8" fill={color}/>
      <rect x="13" y="17" width="2" height="4" fill={color}/>
      <rect x="4" y="2" width="3" height="2" fill={color}/>
      <rect x="2" y="4" width="2" height="3" fill={color}/>
      <rect x="4" y="7" width="3" height="2" fill={color}/>
      <rect x="7" y="4" width="2" height="3" fill={color}/>
    </svg>
  );
}
