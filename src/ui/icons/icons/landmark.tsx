import React from 'react';
import type { IconProps } from '../types';

export function LandmarkIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="2" y="8" width="20" height="2" fill={color}/>
      <rect x="2" y="6" width="4" height="2" fill={color}/>
      <rect x="6" y="4" width="4" height="2" fill={color}/>
      <rect x="10" y="2" width="4" height="2" fill={color}/>
      <rect x="14" y="4" width="4" height="2" fill={color}/>
      <rect x="18" y="6" width="4" height="2" fill={color}/>
      <rect x="5" y="12" width="2" height="6" fill={color}/>
      <rect x="9" y="12" width="2" height="6" fill={color}/>
      <rect x="13" y="12" width="2" height="6" fill={color}/>
      <rect x="17" y="12" width="2" height="6" fill={color}/>
      <rect x="2" y="20" width="20" height="2" fill={color}/>
    </svg>
  );
}
