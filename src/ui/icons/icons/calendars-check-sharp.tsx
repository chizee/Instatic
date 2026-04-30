import React from 'react';
import type { IconProps } from '../types';

export function CalendarsCheckSharpIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="6" y="4" width="16" height="2" fill={color}/>
      <rect x="6" y="16" width="6" height="2" fill={color}/>
      <rect x="2" y="20" width="10" height="2" fill={color}/>
      <rect x="6" y="10" width="2" height="6" fill={color}/>
      <rect x="2" y="10" width="2" height="10" fill={color}/>
      <rect x="6" y="6" width="2" height="2" fill={color}/>
      <rect x="20" y="6" width="2" height="2" fill={color}/>
      <rect x="20" y="10" width="2" height="4" fill={color}/>
      <rect x="6" y="8" width="16" height="2" fill={color}/>
      <rect x="16" y="2" width="2" height="2" fill={color}/>
      <rect x="10" y="2" width="2" height="2" fill={color}/>
      <rect x="2" y="8" width="4" height="2" fill={color}/>
      <rect x="2" y="12" width="4" height="2" fill={color}/>
      <rect x="14.5" y="18.5" width="1" height="1" fill={color} stroke={color}/>
      <rect x="16.5" y="20.5" width="1" height="1" fill={color} stroke={color}/>
      <rect x="18.5" y="18.5" width="1" height="1" fill={color} stroke={color}/>
      <rect x="20.5" y="16.5" width="1" height="1" fill={color} stroke={color}/>
    </svg>
  );
}
