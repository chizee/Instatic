import React from 'react';
import type { IconProps } from '../types';

export function BandageSharpIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="1" y="5" width="22" height="2" fill={color}/>
      <rect x="1" y="17" width="22" height="2" fill={color}/>
      <rect x="1" y="7" width="2" height="10" fill={color}/>
      <rect x="21" y="7" width="2" height="10" fill={color}/>
      <rect x="5" y="7" width="2" height="10" fill={color}/>
      <rect x="17" y="7" width="2" height="10" fill={color}/>
      <rect x="9" y="9" width="2" height="2" fill={color}/>
      <rect x="13" y="9" width="2" height="2" fill={color}/>
      <rect x="13" y="13" width="2" height="2" fill={color}/>
      <rect x="9" y="13" width="2" height="2" fill={color}/>
    </svg>
  );
}
