import React from 'react';
import type { IconProps } from '../types';

export function CpuSharpIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="5" y="3" width="14" height="2" fill={color}/>
      <rect x="5" y="19" width="14" height="2" fill={color}/>
      <rect x="3" y="5" width="2" height="14" fill={color}/>
      <rect x="19" y="5" width="2" height="14" fill={color}/>
      <rect x="7" y="7" width="10" height="2" fill={color}/>
      <rect x="7" y="15" width="10" height="2" fill={color}/>
      <rect x="7" y="9" width="2" height="6" fill={color}/>
      <rect x="15" y="9" width="2" height="6" fill={color}/>
      <rect x="11" y="1" width="2" height="2" fill={color}/>
      <rect x="11" y="21" width="2" height="2" fill={color}/>
      <rect x="1" y="11" width="2" height="2" fill={color}/>
      <rect x="21" y="11" width="2" height="2" fill={color}/>
      <rect x="21" y="7" width="2" height="2" fill={color}/>
      <rect x="21" y="15" width="2" height="2" fill={color}/>
      <rect x="1" y="15" width="2" height="2" fill={color}/>
      <rect x="1" y="7" width="2" height="2" fill={color}/>
      <rect x="7" y="1" width="2" height="2" fill={color}/>
      <rect x="15" y="1" width="2" height="2" fill={color}/>
      <rect x="15" y="21" width="2" height="2" fill={color}/>
      <rect x="7" y="21" width="2" height="2" fill={color}/>
    </svg>
  );
}
