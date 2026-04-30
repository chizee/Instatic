import React from 'react';
import type { IconProps } from '../types';

export function CodeIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="5" y="7" width="2" height="2" fill={color}/>
      <rect width="2" height="2" transform="matrix(-1 0 0 1 19 7)" fill={color}/>
      <rect width="2" height="4" transform="matrix(-1 0 0 1 15 6)" fill={color}/>
      <rect width="2" height="4" transform="matrix(-1 0 0 1 13 10)" fill={color}/>
      <rect width="2" height="4" transform="matrix(-1 0 0 1 11 14)" fill={color}/>
      <rect x="3" y="9" width="2" height="2" fill={color}/>
      <rect width="2" height="2" transform="matrix(-1 0 0 1 21 9)" fill={color}/>
      <rect x="1" y="11" width="2" height="2" fill={color}/>
      <rect width="2" height="2" transform="matrix(-1 0 0 1 23 11)" fill={color}/>
      <rect x="3" y="13" width="2" height="2" fill={color}/>
      <rect width="2" height="2" transform="matrix(-1 0 0 1 21 13)" fill={color}/>
      <rect x="5" y="15" width="2" height="2" fill={color}/>
      <rect width="2" height="2" transform="matrix(-1 0 0 1 19 15)" fill={color}/>
    </svg>
  );
}
