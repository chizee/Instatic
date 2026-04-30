import React from 'react';
import type { IconProps } from '../types';

export function FlipVertical2Icon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="17" y="11" width="2" height="4" transform="rotate(90 17 11)" fill={color}/>
      <rect x="23" y="11" width="2" height="4" transform="rotate(90 23 11)" fill={color}/>
      <rect x="11" y="11" width="2" height="4" transform="rotate(90 11 11)" fill={color}/>
      <rect x="5" y="11" width="2" height="4" transform="rotate(90 5 11)" fill={color}/>
      <rect x="13" y="7" width="2" height="2" transform="rotate(90 13 7)" fill={color}/>
      <rect width="2" height="2" transform="matrix(4.37114e-08 -1 -1 -4.37114e-08 13 17)" fill={color}/>
      <rect x="13" y="5" width="2" height="4" transform="rotate(90 13 5)" fill={color}/>
      <rect width="2" height="4" transform="matrix(8.74228e-08 -1 -1 -2.18557e-08 13 19)" fill={color}/>
      <rect x="15" y="5" width="2" height="2" transform="rotate(90 15 5)" fill={color}/>
      <rect width="2" height="2" transform="matrix(4.37114e-08 -1 -1 -4.37114e-08 15 19)" fill={color}/>
      <rect x="17" y="3" width="2" height="10" transform="rotate(90 17 3)" fill={color}/>
      <rect width="2" height="10" transform="matrix(4.37114e-08 -1 -1 -4.37114e-08 17 21)" fill={color}/>
    </svg>
  );
}
