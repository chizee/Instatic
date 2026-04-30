import React from 'react';
import type { IconProps } from '../types';

export function ArrowsHorizontalIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="13" y="13" width="2" height="10" transform="rotate(-90 13 13)" fill={color}/>
      <rect x="19" y="15" width="2" height="2" transform="rotate(-90 19 15)" fill={color}/>
      <rect x="17" y="17" width="2" height="2" transform="rotate(-90 17 17)" fill={color}/>
      <rect x="19" y="11" width="2" height="2" transform="rotate(-90 19 11)" fill={color}/>
      <rect x="17" y="15" width="8" height="2" transform="rotate(-90 17 15)" fill={color}/>
      <rect width="2" height="10" transform="matrix(4.37114e-08 -1 -1 -4.37114e-08 11 13)" fill={color}/>
      <rect width="2" height="2" transform="matrix(4.37114e-08 -1 -1 -4.37114e-08 5 15)" fill={color}/>
      <rect width="2" height="2" transform="matrix(4.37114e-08 -1 -1 -4.37114e-08 7 17)" fill={color}/>
      <rect width="2" height="2" transform="matrix(4.37114e-08 -1 -1 -4.37114e-08 5 11)" fill={color}/>
      <rect width="8" height="2" transform="matrix(1.09278e-08 -1 -1 -1.74846e-07 7 15)" fill={color}/>
    </svg>
  );
}
