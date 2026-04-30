import React from 'react';
import type { IconProps } from '../types';

export function ArrowLeftIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="20" y="11" width="2" height="16" transform="rotate(90 20 11)" fill={color}/>
      <rect x="8" y="13" width="2" height="2" transform="rotate(90 8 13)" fill={color}/>
      <rect x="10" y="15" width="2" height="2" transform="rotate(90 10 15)" fill={color}/>
      <rect x="12" y="17" width="2" height="2" transform="rotate(90 12 17)" fill={color}/>
      <rect width="2" height="2" transform="matrix(4.37114e-08 -1 -1 -4.37114e-08 8 11)" fill={color}/>
      <rect width="8" height="2" transform="matrix(4.37114e-08 -1 -1 -4.37114e-08 10 15)" fill={color}/>
      <rect width="12" height="2" transform="matrix(4.37114e-08 -1 -1 -4.37114e-08 12 17)" fill={color}/>
    </svg>
  );
}
