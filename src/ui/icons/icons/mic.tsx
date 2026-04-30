import React from 'react';
import type { IconProps } from '../types';

export function MicIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="10" y="2" width="4" height="2" fill={color}/>
      <rect x="8" y="4" width="2" height="10" fill={color}/>
      <rect x="10" y="14" width="4" height="2" fill={color}/>
      <rect x="14" y="4" width="2" height="10" fill={color}/>
      <rect x="4" y="10" width="2" height="6" fill={color}/>
      <rect x="6" y="16" width="2" height="2" fill={color}/>
      <rect x="8" y="18" width="8" height="2" fill={color}/>
      <rect x="16" y="16" width="2" height="2" fill={color}/>
      <rect x="18" y="10" width="2" height="6" fill={color}/>
      <rect x="11" y="20" width="2" height="2" fill={color}/>
    </svg>
  );
}
