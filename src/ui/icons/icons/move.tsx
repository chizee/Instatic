import React from 'react';
import type { IconProps } from '../types';

export function MoveIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="11" y="2" width="2" height="2" fill={color}/>
      <rect x="11" y="2" width="2" height="2" fill={color}/>
      <rect x="11" y="20" width="2" height="2" fill={color}/>
      <rect x="7" y="4" width="10" height="2" fill={color}/>
      <rect x="9" y="2" width="6" height="2" fill={color}/>
      <rect x="9" y="20" width="6" height="2" fill={color}/>
      <rect x="7" y="18" width="10" height="2" fill={color}/>
      <rect x="2" y="11" width="2" height="2" fill={color}/>
      <rect width="2" height="2" transform="matrix(-1 0 0 1 22 11)" fill={color}/>
      <rect x="2" y="9" width="2" height="6" fill={color}/>
      <rect x="4" y="7" width="2" height="10" fill={color}/>
      <rect width="2" height="10" transform="matrix(-1 0 0 1 20 7)" fill={color}/>
      <rect width="2" height="6" transform="matrix(-1 0 0 1 22 9)" fill={color}/>
      <rect y="11" width="24" height="2" fill={color}/>
      <rect x="11" y="6" width="2" height="3" fill={color}/>
      <rect x="11" width="2" height="24" fill={color}/>
    </svg>
  );
}
