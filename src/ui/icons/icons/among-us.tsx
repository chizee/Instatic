import React from 'react';
import type { IconProps } from '../types';

export function AmongUsIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="6" y="2" width="10" height="2" fill={color}/>
      <rect x="16" y="4" width="2" height="16" fill={color}/>
      <rect x="18" y="9" width="2" height="2" fill={color}/>
      <rect x="20" y="11" width="2" height="9" fill={color}/>
      <rect x="2" y="20" width="20" height="2" fill={color}/>
      <rect x="4" y="6" width="8" height="2" fill={color}/>
      <rect x="12" y="8" width="2" height="4" fill={color}/>
      <rect x="2" y="8" width="2" height="4" fill={color}/>
      <rect x="4" y="12" width="8" height="2" fill={color}/>
      <rect x="4" y="4" width="2" height="2" fill={color}/>
      <rect x="4" y="14" width="2" height="2" fill={color}/>
      <rect x="2" y="16" width="2" height="5" fill={color}/>
    </svg>
  );
}
