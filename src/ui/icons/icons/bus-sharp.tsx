import React from 'react';
import type { IconProps } from '../types';

export function BusSharpIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="4" y="15" width="6" height="2" fill={color}/>
      <rect x="14" y="15" width="6" height="2" fill={color}/>
      <rect x="4" y="19" width="6" height="2" fill={color}/>
      <rect x="14" y="19" width="6" height="2" fill={color}/>
      <rect y="7" width="2" height="10" fill={color}/>
      <rect y="5" width="22" height="2" fill={color}/>
      <rect x="22" y="7" width="2" height="10" fill={color}/>
      <rect x="2" y="11" width="20" height="2" fill={color}/>
      <rect x="4" y="17" width="2" height="2" fill={color}/>
      <rect x="8" y="17" width="8" height="2" fill={color}/>
      <rect y="17" width="4" height="2" fill={color}/>
      <rect x="18" y="17" width="6" height="2" fill={color}/>
      <rect x="14" y="7" width="2" height="4" fill={color}/>
      <rect x="7" y="7" width="2" height="4" fill={color}/>
    </svg>
  );
}
