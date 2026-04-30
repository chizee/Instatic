import React from 'react';
import type { IconProps } from '../types';

export function AlignCenterVerticalIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="22" y="5" width="4" height="2" transform="rotate(90 22 5)" fill={color}/>
      <rect x="19" y="15" width="4" height="2" transform="rotate(90 19 15)" fill={color}/>
      <rect width="4" height="2" transform="matrix(-4.37114e-08 1 1 4.37114e-08 5 15)" fill={color}/>
      <rect x="9" y="3" width="2" height="5" transform="rotate(90 9 3)" fill={color}/>
      <rect x="20" y="3" width="2" height="5" transform="rotate(90 20 3)" fill={color}/>
      <rect x="17" y="13" width="2" height="2" transform="rotate(90 17 13)" fill={color}/>
      <rect width="2" height="2" transform="matrix(-4.37114e-08 1 1 4.37114e-08 7 13)" fill={color}/>
      <rect x="4" y="5" width="4" height="2" transform="rotate(90 4 5)" fill={color}/>
      <rect x="9" y="9" width="2" height="5" transform="rotate(90 9 9)" fill={color}/>
      <rect x="20" y="9" width="2" height="5" transform="rotate(90 20 9)" fill={color}/>
      <rect x="17" y="19" width="2" height="2" transform="rotate(90 17 19)" fill={color}/>
      <rect width="2" height="2" transform="matrix(-4.37114e-08 1 1 4.37114e-08 7 19)" fill={color}/>
      <rect x="13" y="2" width="20" height="2" transform="rotate(90 13 2)" fill={color}/>
    </svg>
  );
}
