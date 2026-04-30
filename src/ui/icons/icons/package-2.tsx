import React from 'react';
import type { IconProps } from '../types';

export function Package2Icon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="2" y="10" width="2" height="10" fill={color}/>
      <rect x="4" y="20" width="16" height="2" fill={color}/>
      <rect x="20" y="10" width="2" height="10" fill={color}/>
      <rect x="2" y="8" width="20" height="2" fill={color}/>
      <rect x="20" y="6" width="2" height="2" fill={color}/>
      <rect x="2" y="6" width="2" height="2" fill={color}/>
      <rect x="4" y="4" width="2" height="2" fill={color}/>
      <rect x="6" y="2" width="12" height="2" fill={color}/>
      <rect x="18" y="4" width="2" height="2" fill={color}/>
      <rect x="11" y="4" width="2" height="4" fill={color}/>
    </svg>
  );
}
