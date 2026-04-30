import React from 'react';
import type { IconProps } from '../types';

export function WineGlass2SharpIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="8" y="20" width="8" height="2" fill={color}/>
      <rect x="11" y="10" width="2" height="10" fill={color}/>
      <rect x="13" y="10" width="2" height="6" fill={color}/>
      <rect x="9" y="10" width="2" height="6" fill={color}/>
      <rect x="7" y="10" width="2" height="4" fill={color}/>
      <rect x="15" y="10" width="2" height="4" fill={color}/>
      <rect x="17" y="4" width="2" height="8" fill={color}/>
      <rect x="5" y="4" width="2" height="8" fill={color}/>
      <rect x="5" y="2" width="14" height="2" fill={color}/>
      <rect x="7" y="8" width="10" height="2" fill={color}/>
    </svg>
  );
}
