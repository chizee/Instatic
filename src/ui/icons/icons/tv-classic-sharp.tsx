import React from 'react';
import type { IconProps } from '../types';

export function TvClassicSharpIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect width="20" height="2" transform="matrix(1 0 0 -1 2 20)" fill={color}/>
      <rect width="20" height="2" transform="matrix(1 0 0 -1 2 8)" fill={color}/>
      <rect width="2" height="2" transform="matrix(1 0 0 -1 9 6)" fill={color}/>
      <rect width="2" height="2" transform="matrix(1 0 0 -1 13 6)" fill={color}/>
      <rect width="2" height="2" transform="matrix(1 0 0 -1 15 4)" fill={color}/>
      <rect width="2" height="2" transform="matrix(1 0 0 -1 7 4)" fill={color}/>
      <rect width="2" height="10" transform="matrix(1 0 0 -1 2 18)" fill={color}/>
      <rect width="2" height="10" transform="matrix(1 0 0 -1 20 18)" fill={color}/>
    </svg>
  );
}
