import React from 'react';
import type { IconProps } from '../types';

export function SpotlightIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <path d="M19 2H5V4H19V2Z" fill={color}/>
      <path d="M19 20H5V22H19V20Z" fill={color}/>
      <path d="M5 4H3V20H5V4Z" fill={color}/>
      <path d="M21 4H19V20H21V4Z" fill={color}/>
      <path d="M13 6H7V8H13V6Z" fill={color}/>
      <path d="M9 10H7V18H9V10Z" fill={color}/>
      <path d="M17 10H15V18H17V10Z" fill={color}/>
      <rect x="9" y="10" width="6" height="2" fill={color}/>
      <rect x="9" y="16" width="6" height="2" fill={color}/>
    </svg>
  );
}
