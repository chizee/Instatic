import React from 'react';
import type { IconProps } from '../types';

export function MinusBoxMultipleSharpIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect width="14" height="2" transform="matrix(-1 0 0 1 21 3)" fill={color}/>
      <rect width="14" height="2" transform="matrix(-1 0 0 1 21 15)" fill={color}/>
      <rect width="14" height="2" transform="matrix(-1 0 0 1 17 19)" fill={color}/>
      <rect width="2" height="10" transform="matrix(-1 0 0 1 21 5)" fill={color}/>
      <rect width="2" height="10" transform="matrix(-1 0 0 1 9 5)" fill={color}/>
      <rect width="2" height="10" transform="matrix(-1 0 0 1 5 9)" fill={color}/>
      <rect width="6" height="2" transform="matrix(-1 0 0 1 17 9)" fill={color}/>
      <rect width="4" height="2" transform="matrix(-1 0 0 1 7 7)" fill={color}/>
      <rect width="2" height="2" transform="matrix(-1 0 0 1 17 17)" fill={color}/>
    </svg>
  );
}
