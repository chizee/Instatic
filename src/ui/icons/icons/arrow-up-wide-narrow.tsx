import React from 'react';
import type { IconProps } from '../types';

export function ArrowUpWideNarrowIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect width="2" height="18" transform="matrix(1 0 0 -1 6 21)" fill={color}/>
      <rect width="6" height="2" transform="matrix(1 0 0 -1 4 7)" fill={color}/>
      <rect width="10" height="2" transform="matrix(1 0 0 -1 2 9)" fill={color}/>
      <rect width="6" height="2" transform="matrix(1 0 0 -1 10 21)" fill={color}/>
      <rect width="9" height="2" transform="matrix(1 0 0 -1 10 17)" fill={color}/>
      <rect width="12" height="2" transform="matrix(1 0 0 -1 10 13)" fill={color}/>
    </svg>
  );
}
