import React from 'react';
import type { IconProps } from '../types';

export function TeachSharpIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="3" y="2" width="4" height="4" fill={color}/>
      <rect x="2" y="8" width="12" height="2" fill={color}/>
      <rect x="9" y="4" width="11" height="2" fill={color}/>
      <rect x="10" y="14" width="10" height="2" fill={color}/>
      <rect x="2" y="9" width="6" height="7" fill={color}/>
      <rect x="2" y="16" width="2" height="4" fill={color}/>
      <rect x="6" y="16" width="2" height="4" fill={color}/>
      <rect x="20" y="4" width="2" height="12" fill={color}/>
    </svg>
  );
}
