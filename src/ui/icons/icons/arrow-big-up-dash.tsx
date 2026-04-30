import React from 'react';
import type { IconProps } from '../types';

export function ArrowBigUpDashIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect width="8" height="2" transform="matrix(1 0 0 -1 8 21)" fill={color}/>
      <rect width="8" height="2" transform="matrix(1 0 0 -1 8 17)" fill={color}/>
      <rect width="2" height="4" transform="matrix(1 0 0 -1 8 17)" fill={color}/>
      <rect width="5" height="2" transform="matrix(1 0 0 -1 3 13)" fill={color}/>
      <rect width="2" height="2" transform="matrix(1 0 0 -1 3 11)" fill={color}/>
      <rect width="2" height="2" transform="matrix(1 0 0 -1 5 9)" fill={color}/>
      <rect width="2" height="2" transform="matrix(1 0 0 -1 7 7)" fill={color}/>
      <rect width="2" height="2" transform="matrix(1 0 0 -1 9 5)" fill={color}/>
      <rect width="2" height="2" transform="matrix(1 0 0 -1 11 3)" fill={color}/>
      <rect width="2" height="2" transform="matrix(1 0 0 -1 13 5)" fill={color}/>
      <rect width="2" height="2" transform="matrix(1 0 0 -1 15 7)" fill={color}/>
      <rect width="2" height="2" transform="matrix(1 0 0 -1 17 9)" fill={color}/>
      <rect width="2" height="4" transform="matrix(1 0 0 -1 19 13)" fill={color}/>
      <rect width="3" height="2" transform="matrix(1 0 0 -1 16 13)" fill={color}/>
      <rect width="2" height="4" transform="matrix(1 0 0 -1 14 17)" fill={color}/>
    </svg>
  );
}
