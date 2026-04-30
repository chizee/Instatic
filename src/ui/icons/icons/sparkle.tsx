import React from 'react';
import type { IconProps } from '../types';

export function SparkleIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="11" y="1" width="2" height="4" fill={color}/>
      <rect width="2" height="4" transform="matrix(1 0 0 -1 11 23)" fill={color}/>
      <rect x="9" y="5" width="2" height="4" fill={color}/>
      <rect width="2" height="4" transform="matrix(1 0 0 -1 9 19)" fill={color}/>
      <rect x="13" y="5" width="2" height="4" fill={color}/>
      <rect width="2" height="4" transform="matrix(1 0 0 -1 13 19)" fill={color}/>
      <rect x="5" y="9" width="4" height="2" fill={color}/>
      <rect width="4" height="2" transform="matrix(-1 0 0 1 19 9)" fill={color}/>
      <rect x="1" y="11" width="4" height="2" fill={color}/>
      <rect width="4" height="2" transform="matrix(-1 0 0 1 23 11)" fill={color}/>
      <rect x="5" y="13" width="4" height="2" fill={color}/>
      <rect width="4" height="2" transform="matrix(-1 0 0 1 19 13)" fill={color}/>
    </svg>
  );
}
