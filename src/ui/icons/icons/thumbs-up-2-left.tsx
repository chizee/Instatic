import React from 'react';
import type { IconProps } from '../types';

export function ThumbsUp2LeftIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect width="2" height="10" transform="matrix(-1 0 0 1 22 11)" fill={color}/>
      <rect width="16" height="2" transform="matrix(-1 0 0 1 20 21)" fill={color}/>
      <rect width="2" height="10" transform="matrix(-1 0 0 1 4 11)" fill={color}/>
      <rect width="7" height="2" transform="matrix(-1 0 0 1 11 9)" fill={color}/>
      <rect width="2" height="2" transform="matrix(-1 0 0 1 10 7)" fill={color}/>
      <rect width="2" height="4" transform="matrix(-1 0 0 1 8 3)" fill={color}/>
      <rect width="2" height="2" transform="matrix(-1 0 0 1 10 1)" fill={color}/>
      <rect width="2" height="2" transform="matrix(-1 0 0 1 12 3)" fill={color}/>
      <rect width="2" height="2" transform="matrix(-1 0 0 1 14 5)" fill={color}/>
      <rect width="2" height="2" transform="matrix(-1 0 0 1 16 7)" fill={color}/>
      <rect width="4" height="2" transform="matrix(-1 0 0 1 20 9)" fill={color}/>
      <rect width="2" height="10" transform="matrix(-1 0 0 1 18 11)" fill={color}/>
      <rect width="4" height="2" transform="matrix(-1 0 0 1 8 13)" fill={color}/>
      <rect width="2" height="2" transform="matrix(-1 0 0 1 6 17)" fill={color}/>
    </svg>
  );
}
