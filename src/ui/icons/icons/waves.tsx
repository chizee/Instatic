import React from 'react';
import type { IconProps } from '../types';

export function WavesIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect width="4" height="2" transform="matrix(1 0 0 -1 2 18)" fill={color}/>
      <rect width="4" height="2" transform="matrix(1 0 0 -1 2 12)" fill={color}/>
      <rect width="4" height="2" transform="matrix(1 0 0 -1 2 6)" fill={color}/>
      <rect width="4" height="2" transform="matrix(1 0 0 -1 6 20)" fill={color}/>
      <rect width="4" height="2" transform="matrix(1 0 0 -1 6 14)" fill={color}/>
      <rect width="4" height="2" transform="matrix(1 0 0 -1 6 8)" fill={color}/>
      <rect width="4" height="2" transform="matrix(1 0 0 -1 10 18)" fill={color}/>
      <rect width="4" height="2" transform="matrix(1 0 0 -1 10 12)" fill={color}/>
      <rect width="4" height="2" transform="matrix(1 0 0 -1 10 6)" fill={color}/>
      <rect width="4" height="2" transform="matrix(1 0 0 -1 14 20)" fill={color}/>
      <rect width="4" height="2" transform="matrix(1 0 0 -1 14 14)" fill={color}/>
      <rect width="4" height="2" transform="matrix(1 0 0 -1 14 8)" fill={color}/>
      <rect width="4" height="2" transform="matrix(1 0 0 -1 18 18)" fill={color}/>
      <rect width="4" height="2" transform="matrix(1 0 0 -1 18 12)" fill={color}/>
      <rect width="4" height="2" transform="matrix(1 0 0 -1 18 6)" fill={color}/>
    </svg>
  );
}
