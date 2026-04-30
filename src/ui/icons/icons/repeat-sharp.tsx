import React from 'react';
import type { IconProps } from '../types';

export function RepeatSharpIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="17" y="5" width="2" height="2" fill={color}/>
      <rect x="5" y="17" width="2" height="2" fill={color}/>
      <rect x="11" y="3" width="2" height="6" fill={color}/>
      <rect x="9" y="1" width="2" height="8" fill={color}/>
      <rect x="9" y="9" width="2" height="2" fill={color}/>
      <rect width="10" height="2" transform="matrix(-1 0 0 1 19 17)" fill={color}/>
      <rect width="2" height="14" transform="matrix(-1 0 0 1 5 5)" fill={color}/>
      <rect width="2" height="6" transform="matrix(-1 0 0 1 13 15)" fill={color}/>
      <rect width="2" height="8" transform="matrix(-1 0 0 1 15 13)" fill={color}/>
      <rect width="2" height="2" transform="matrix(-1 0 0 1 15 21)" fill={color}/>
      <rect x="5" y="5" width="10" height="2" fill={color}/>
      <rect width="2" height="14" transform="matrix(1 0 0 -1 19 19)" fill={color}/>
    </svg>
  );
}
