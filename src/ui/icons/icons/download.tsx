import React from 'react';
import type { IconProps } from '../types';

export function DownloadIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="21" y="15" width="4" height="2" transform="rotate(90 21 15)" fill={color}/>
      <rect x="19" y="19" width="2" height="14" transform="rotate(90 19 19)" fill={color}/>
      <rect x="5" y="15" width="4" height="2" transform="rotate(90 5 15)" fill={color}/>
      <rect x="13" y="3.00006" width="14" height="2" transform="rotate(90 13 3.00006)" fill={color}/>
      <rect width="2" height="10" transform="matrix(-4.37114e-08 1 1 4.37114e-08 7 11)" fill={color}/>
      <rect width="2" height="2" transform="matrix(-4.37114e-08 1 1 4.37114e-08 9 13)" fill={color}/>
      <rect width="2" height="2" transform="matrix(-4.37114e-08 1 1 4.37114e-08 13 13)" fill={color}/>
      <rect width="2" height="2" transform="matrix(-4.37114e-08 1 1 4.37114e-08 15 11)" fill={color}/>
    </svg>
  );
}
