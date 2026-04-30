import React from 'react';
import type { IconProps } from '../types';

export function SprayAreaIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="3" y="7" width="6" height="2" fill={color}/>
      <rect x="5" y="5" width="2" height="2" fill={color}/>
      <rect x="1" y="9" width="2" height="10" fill={color}/>
      <rect x="3" y="17" width="6" height="2" fill={color}/>
      <rect x="9" y="9" width="2" height="10" fill={color}/>
      <rect x="12" y="5" width="2" height="2" fill={color}/>
      <rect x="9" y="5" width="2" height="2" fill={color}/>
      <rect x="15" y="5" width="2" height="2" fill={color}/>
      <rect x="18" y="5" width="2" height="2" fill={color}/>
      <rect x="21" y="5" width="2" height="2" fill={color}/>
      <rect x="21" y="8" width="2" height="2" fill={color}/>
      <rect x="21" y="11" width="2" height="2" fill={color}/>
      <rect x="21" y="14" width="2" height="2" fill={color}/>
      <rect x="21" y="17" width="2" height="2" fill={color}/>
      <rect x="18" y="17" width="2" height="2" fill={color}/>
      <rect x="15" y="17" width="2" height="2" fill={color}/>
      <rect x="12" y="17" width="2" height="2" fill={color}/>
      <rect x="5" y="13" width="6" height="2" fill={color}/>
    </svg>
  );
}
