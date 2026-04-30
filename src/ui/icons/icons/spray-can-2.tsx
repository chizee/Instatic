import React from 'react';
import type { IconProps } from '../types';

export function SprayCan2Icon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect width="4" height="4" transform="matrix(-1 0 0 1 14 3)" fill={color}/>
      <rect width="8" height="2" transform="matrix(-1 0 0 1 16 7)" fill={color}/>
      <rect width="12" height="2" transform="matrix(-1 0 0 1 18 21)" fill={color}/>
      <rect width="2" height="12" transform="matrix(-1 0 0 1 8 9)" fill={color}/>
      <rect width="2" height="12" transform="matrix(-1 0 0 1 18 9)" fill={color}/>
      <rect width="6" height="2" transform="matrix(-1 0 0 1 14 17)" fill={color}/>
      <rect width="2" height="6" transform="matrix(-1 0 0 1 14 13)" fill={color}/>
      <rect width="8" height="2" transform="matrix(-1 0 0 1 14 13)" fill={color}/>
      <rect width="2" height="2" transform="matrix(-1 0 0 1 8 3)" fill={color}/>
      <rect width="2" height="2" transform="matrix(-1 0 0 1 6 1)" fill={color}/>
      <rect width="2" height="2" transform="matrix(-1 0 0 1 6 5)" fill={color}/>
    </svg>
  );
}
