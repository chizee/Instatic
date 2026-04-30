import React from 'react';
import type { IconProps } from '../types';

export function GamepadDirectionsSharpIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="9" y="2" width="6" height="2" fill={color}/>
      <rect x="22" y="9" width="6" height="2" transform="rotate(90 22 9)" fill={color}/>
      <rect width="6" height="2" transform="matrix(1 0 0 -1 9 22)" fill={color}/>
      <rect x="9" y="4" width="2" height="4" fill={color}/>
      <rect x="20" y="9" width="2" height="4" transform="rotate(90 20 9)" fill={color}/>
      <rect width="2" height="4" transform="matrix(1 0 0 -1 9 20)" fill={color}/>
      <rect width="2" height="4" transform="matrix(-4.37114e-08 1 1 4.37114e-08 4 9)" fill={color}/>
      <rect x="13" y="4" width="2" height="4" fill={color}/>
      <rect x="20" y="13" width="2" height="4" transform="rotate(90 20 13)" fill={color}/>
      <rect width="2" height="4" transform="matrix(1 0 0 -1 13 20)" fill={color}/>
      <rect width="2" height="4" transform="matrix(-4.37114e-08 1 1 4.37114e-08 4 13)" fill={color}/>
      <rect x="9" y="7" width="6" height="2" fill={color}/>
      <rect x="17" y="9" width="6" height="2" transform="rotate(90 17 9)" fill={color}/>
      <rect width="6" height="2" transform="matrix(1 0 0 -1 9 17)" fill={color}/>
      <rect width="6" height="2" transform="matrix(-4.37114e-08 1 1 4.37114e-08 7 9)" fill={color}/>
      <rect x="2" y="9" width="2" height="6" fill={color}/>
    </svg>
  );
}
