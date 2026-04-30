import React from 'react';
import type { IconProps } from '../types';

export function SlidersHorizontalIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="13" y="2" width="2" height="6" fill={color}/>
      <rect x="15" y="4" width="7" height="2" fill={color}/>
      <rect x="2" y="4" width="9" height="2" fill={color}/>
      <rect x="2" y="18" width="11" height="2" fill={color}/>
      <rect x="15" y="16" width="2" height="6" fill={color}/>
      <rect x="17" y="18" width="5" height="2" fill={color}/>
      <rect x="11" y="11" width="11" height="2" fill={color}/>
      <rect x="7" y="9" width="2" height="6" fill={color}/>
      <rect x="2" y="11" width="5" height="2" fill={color}/>
    </svg>
  );
}
