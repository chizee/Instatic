import React from 'react';
import type { IconProps } from '../types';

export function ToiletSharpIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="2" y="2" width="14" height="2" fill={color}/>
      <rect x="2" y="4" width="2" height="12" fill={color}/>
      <rect x="8" y="11" width="12" height="2" fill={color}/>
      <rect x="20" y="11" width="2" height="5" fill={color}/>
      <rect x="14" y="16" width="8" height="2" fill={color}/>
      <rect x="14" y="4" width="2" height="7" fill={color}/>
      <rect x="2" y="16" width="6" height="2" fill={color}/>
      <rect x="6" y="18" width="2" height="2" fill={color}/>
      <rect x="14" y="18" width="2" height="2" fill={color}/>
      <rect x="4" y="20" width="14" height="2" fill={color}/>
    </svg>
  );
}
