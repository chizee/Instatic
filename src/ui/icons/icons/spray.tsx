import React from 'react';
import type { IconProps } from '../types';

export function SprayIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="4" y="9" width="6" height="2" fill={color}/>
      <rect x="6" y="7" width="2" height="2" fill={color}/>
      <rect x="2" y="11" width="2" height="10" fill={color}/>
      <rect x="4" y="19" width="6" height="2" fill={color}/>
      <rect x="10" y="11" width="2" height="10" fill={color}/>
      <rect x="6" y="15" width="6" height="2" fill={color}/>
      <rect x="14" y="4" width="2" height="2" fill={color}/>
      <rect x="18" y="2" width="2" height="2" fill={color}/>
      <rect x="18" y="12" width="2" height="2" fill={color}/>
      <rect x="16" y="6" width="2" height="4" fill={color}/>
      <rect x="20" y="4" width="2" height="8" fill={color}/>
      <rect x="14" y="10" width="2" height="2" fill={color}/>
      <rect x="11" y="7" width="2" height="2" fill={color}/>
    </svg>
  );
}
