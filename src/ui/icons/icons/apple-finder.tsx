import React from 'react';
import type { IconProps } from '../types';

export function AppleFinderIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="4" y="3" width="16" height="2" fill={color}/>
      <rect x="4" y="19" width="16" height="2" fill={color}/>
      <rect x="2" y="5" width="2" height="14" fill={color}/>
      <rect x="20" y="5" width="2" height="14" fill={color}/>
      <rect x="10" y="5" width="2" height="7" fill={color}/>
      <rect x="12" y="12" width="2" height="7" fill={color}/>
      <rect x="10" y="11" width="4" height="2" fill={color}/>
      <rect x="6" y="7" width="2" height="4" fill={color}/>
      <rect x="16" y="7" width="2" height="4" fill={color}/>
      <rect x="6" y="13" width="2" height="2" fill={color}/>
      <rect x="16" y="13" width="2" height="2" fill={color}/>
      <rect x="8" y="15" width="8" height="2" fill={color}/>
    </svg>
  );
}
