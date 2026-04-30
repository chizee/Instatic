import React from 'react';
import type { IconProps } from '../types';

export function AnnoyedIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="6" y="20" width="12" height="2" fill={color}/>
      <rect x="6" y="2" width="12" height="2" fill={color}/>
      <rect x="18" y="4" width="2" height="2" fill={color}/>
      <rect x="4" y="4" width="2" height="2" fill={color}/>
      <rect x="4" y="18" width="2" height="2" fill={color}/>
      <rect x="18" y="18" width="2" height="2" fill={color}/>
      <rect x="2" y="6" width="2" height="12" fill={color}/>
      <rect x="20" y="6" width="2" height="12" fill={color}/>
      <rect x="7" y="8" width="3" height="2" fill={color}/>
      <rect x="14" y="8" width="3" height="2" fill={color}/>
      <rect x="7" y="14" width="10" height="2" fill={color}/>
    </svg>
  );
}
