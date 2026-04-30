import React from 'react';
import type { IconProps } from '../types';

export function MapPinHomeIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="4" y="4" width="2" height="2" fill={color}/>
      <rect width="2" height="2" transform="matrix(-1 0 0 1 18 4)" fill={color}/>
      <rect x="6" y="17" width="2" height="2" fill={color}/>
      <rect x="8" y="19" width="2" height="2" fill={color}/>
      <rect x="10" y="21" width="2" height="2" fill={color}/>
      <rect x="4" y="14" width="2" height="3" fill={color}/>
      <rect x="2" y="6" width="2" height="8" fill={color}/>
      <rect width="2" height="3" transform="matrix(-1 0 0 1 20 6)" fill={color}/>
      <rect x="9" y="6" width="4" height="2" fill={color}/>
      <rect x="7" y="8" width="2" height="4" fill={color}/>
      <rect x="9" y="12" width="4" height="2" fill={color}/>
      <rect x="13" y="8" width="2" height="4" fill={color}/>
      <rect x="16" y="13" width="2" height="2" fill={color}/>
      <rect x="14" y="15" width="2" height="6" fill={color}/>
      <rect x="22" y="15" width="2" height="6" fill={color}/>
      <rect x="18" y="11" width="2" height="2" fill={color}/>
      <rect x="20" y="13" width="2" height="2" fill={color}/>
      <rect x="16" y="19" width="6" height="2" fill={color}/>
      <rect x="18" y="17" width="2" height="2" fill={color}/>
    </svg>
  );
}
