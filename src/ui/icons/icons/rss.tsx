import React from 'react';
import type { IconProps } from '../types';

export function RssIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="4" y="10" width="6" height="2" fill={color}/>
      <rect x="12" y="14" width="2" height="6" fill={color}/>
      <rect x="18" y="14" width="2" height="6" fill={color}/>
      <rect x="4" y="16" width="4" height="4" fill={color}/>
      <rect x="16" y="10" width="2" height="4" fill={color}/>
      <rect x="14" y="8" width="2" height="2" fill={color}/>
      <rect x="4" y="4" width="6" height="2" fill={color}/>
      <rect x="10" y="6" width="4" height="2" fill={color}/>
      <rect x="10" y="12" width="2" height="2" fill={color}/>
    </svg>
  );
}
