import React from 'react';
import type { IconProps } from '../types';

export function AsanaIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="10" y="3" width="4" height="2" fill={color}/>
      <rect x="8" y="5" width="2" height="4" fill={color}/>
      <rect x="10" y="9" width="4" height="2" fill={color}/>
      <rect x="14" y="5" width="2" height="4" fill={color}/>
      <rect x="5" y="12" width="4" height="2" fill={color}/>
      <rect x="3" y="14" width="2" height="4" fill={color}/>
      <rect x="5" y="18" width="4" height="2" fill={color}/>
      <rect x="9" y="14" width="2" height="4" fill={color}/>
      <rect x="15" y="12" width="4" height="2" fill={color}/>
      <rect x="13" y="14" width="2" height="4" fill={color}/>
      <rect x="15" y="18" width="4" height="2" fill={color}/>
      <rect x="19" y="14" width="2" height="4" fill={color}/>
    </svg>
  );
}
