import React from 'react';
import type { IconProps } from '../types';

export function BarcodeIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="2" y="4" width="2" height="16" fill={color}/>
      <rect x="6" y="4" width="3" height="16" fill={color}/>
      <rect x="11" y="4" width="3" height="16" fill={color}/>
      <rect x="16" y="4" width="2" height="16" fill={color}/>
      <rect x="20" y="4" width="2" height="16" fill={color}/>
    </svg>
  );
}
