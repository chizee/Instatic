import React from 'react';
import type { IconProps } from '../types';

export function BadgeCaptionsIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="3" y="4" width="18" height="2" fill={color}/>
      <rect x="3" y="18" width="18" height="2" fill={color}/>
      <rect x="1" y="6" width="2" height="12" fill={color}/>
      <rect x="21" y="6" width="2" height="12" fill={color}/>
      <rect x="15" y="14" width="4" height="2" fill={color}/>
      <rect x="5" y="10" width="4" height="2" fill={color}/>
      <rect x="5" y="14" width="8" height="2" fill={color}/>
      <rect x="11" y="10" width="8" height="2" fill={color}/>
    </svg>
  );
}
