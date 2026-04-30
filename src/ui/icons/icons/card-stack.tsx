import React from 'react';
import type { IconProps } from '../types';

export function CardStackIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="4" y="4" width="16" height="2" fill={color}/>
      <rect x="4" y="14" width="16" height="2" fill={color}/>
      <rect x="4" y="18" width="16" height="2" fill={color}/>
      <rect x="2" y="6" width="2" height="8" fill={color}/>
      <rect x="20" y="6" width="2" height="8" fill={color}/>
    </svg>
  );
}
