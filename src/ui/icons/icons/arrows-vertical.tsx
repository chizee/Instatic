import React from 'react';
import type { IconProps } from '../types';

export function ArrowsVerticalIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="13" y="11" width="2" height="10" transform="rotate(180 13 11)" fill={color}/>
      <rect x="15" y="5" width="2" height="2" transform="rotate(180 15 5)" fill={color}/>
      <rect x="17" y="7" width="2" height="2" transform="rotate(180 17 7)" fill={color}/>
      <rect x="11" y="5" width="2" height="2" transform="rotate(180 11 5)" fill={color}/>
      <rect x="15" y="7" width="8" height="2" transform="rotate(180 15 7)" fill={color}/>
      <rect width="2" height="10" transform="matrix(-1 0 0 1 13 13)" fill={color}/>
      <rect width="2" height="2" transform="matrix(-1 0 0 1 15 19)" fill={color}/>
      <rect width="2" height="2" transform="matrix(-1 0 0 1 17 17)" fill={color}/>
      <rect width="2" height="2" transform="matrix(-1 0 0 1 11 19)" fill={color}/>
      <rect width="8" height="2" transform="matrix(-1 3.27835e-08 -1.31134e-07 1 15 17)" fill={color}/>
    </svg>
  );
}
