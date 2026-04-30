import React from 'react';
import type { IconProps } from '../types';

export function DollarSharpIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="11" y="2.00003" width="2" height="4" fill={color}/>
      <rect x="11" y="18" width="2" height="4" fill={color}/>
      <rect x="5" y="6" width="14" height="2" fill={color}/>
      <rect x="5" y="16" width="14" height="2" fill={color}/>
      <rect x="5" y="11" width="14" height="2" fill={color}/>
      <rect x="5" y="8" width="2" height="3" fill={color}/>
      <rect x="17" y="13" width="2" height="3" fill={color}/>
    </svg>
  );
}
