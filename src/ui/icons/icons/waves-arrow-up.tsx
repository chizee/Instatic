import React from 'react';
import type { IconProps } from '../types';

export function WavesArrowUpIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect width="4" height="2" transform="matrix(1 0 0 -1 2 21)" fill={color}/>
      <rect width="4" height="2" transform="matrix(1 0 0 -1 2 15)" fill={color}/>
      <rect width="4" height="2" transform="matrix(1 0 0 -1 6 23)" fill={color}/>
      <rect width="4" height="2" transform="matrix(1 0 0 -1 6 17)" fill={color}/>
      <rect width="4" height="2" transform="matrix(1 0 0 -1 10 21)" fill={color}/>
      <rect width="4" height="2" transform="matrix(1 0 0 -1 14 23)" fill={color}/>
      <rect width="4" height="2" transform="matrix(1 0 0 -1 14 17)" fill={color}/>
      <rect width="4" height="2" transform="matrix(1 0 0 -1 10 15)" fill={color}/>
      <rect width="4" height="2" transform="matrix(1 0 0 -1 18 21)" fill={color}/>
      <rect width="4" height="2" transform="matrix(1 0 0 -1 18 15)" fill={color}/>
      <rect width="2" height="10" transform="matrix(1 0 0 -1 11 11)" fill={color}/>
      <rect width="6" height="2" transform="matrix(1 0 0 -1 9 5)" fill={color}/>
      <rect width="10" height="2" transform="matrix(1 0 0 -1 7 7)" fill={color}/>
    </svg>
  );
}
