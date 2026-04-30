import React from 'react';
import type { IconProps } from '../types';

export function BellDotIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="9" y="2" width="6" height="2" fill={color}/>
      <rect x="7" y="4" width="2" height="2" fill={color}/>
      <rect x="5" y="6" width="2" height="7" fill={color}/>
      <rect x="3" y="13" width="2" height="4" fill={color}/>
      <rect x="19" y="13" width="2" height="4" fill={color}/>
      <rect x="3" y="15" width="18" height="2" fill={color}/>
      <rect x="8" y="18" width="2" height="2" fill={color}/>
      <rect x="14" y="18" width="2" height="2" fill={color}/>
      <rect x="10" y="20" width="4" height="2" fill={color}/>
      <rect x="17" y="4" width="3" height="2" fill={color}/>
      <rect x="17" y="9" width="3" height="2" fill={color}/>
      <rect x="15" y="6" width="2" height="3" fill={color}/>
      <rect x="20" y="6" width="2" height="3" fill={color}/>
    </svg>
  );
}
