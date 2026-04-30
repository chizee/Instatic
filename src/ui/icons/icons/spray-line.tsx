import React from 'react';
import type { IconProps } from '../types';

export function SprayLineIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="4" y="9" width="6" height="2" fill={color}/>
      <rect x="6" y="7" width="2" height="2" fill={color}/>
      <rect x="2" y="11" width="2" height="10" fill={color}/>
      <rect x="4" y="19" width="6" height="2" fill={color}/>
      <rect x="10" y="11" width="2" height="10" fill={color}/>
      <rect x="12" y="7" width="2" height="2" fill={color}/>
      <rect x="15" y="7" width="2" height="2" fill={color}/>
      <rect x="18" y="7" width="2" height="2" fill={color}/>
      <rect x="21" y="7" width="2" height="2" fill={color}/>
    </svg>
  );
}
