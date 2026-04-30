import React from 'react';
import type { IconProps } from '../types';

export function ArrowRightIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect width="2" height="16" transform="matrix(4.37114e-08 1 1 -4.37114e-08 4 11)" fill={color}/>
      <rect width="2" height="2" transform="matrix(4.37114e-08 1 1 -4.37114e-08 16 13)" fill={color}/>
      <rect width="2" height="2" transform="matrix(4.37114e-08 1 1 -4.37114e-08 14 15)" fill={color}/>
      <rect width="2" height="2" transform="matrix(4.37114e-08 1 1 -4.37114e-08 12 17)" fill={color}/>
      <rect x="16" y="11" width="2" height="2" transform="rotate(-90 16 11)" fill={color}/>
      <rect x="14" y="15" width="8" height="2" transform="rotate(-90 14 15)" fill={color}/>
      <rect x="12" y="17" width="12" height="2" transform="rotate(-90 12 17)" fill={color}/>
    </svg>
  );
}
