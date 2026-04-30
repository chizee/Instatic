import React from 'react';
import type { IconProps } from '../types';

export function BandcampIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="7" y="4" width="16" height="2" fill={color}/>
      <rect x="1" y="18" width="16" height="2" fill={color}/>
      <rect x="7" y="4" width="2" height="4" fill={color}/>
      <rect x="21" y="4" width="2" height="4" fill={color}/>
      <rect x="5" y="8" width="2" height="4" fill={color}/>
      <rect x="19" y="8" width="2" height="4" fill={color}/>
      <rect x="3" y="12" width="2" height="4" fill={color}/>
      <rect x="1" y="16" width="2" height="4" fill={color}/>
      <rect x="17" y="12" width="2" height="4" fill={color}/>
      <rect x="15" y="16" width="2" height="4" fill={color}/>
    </svg>
  );
}
