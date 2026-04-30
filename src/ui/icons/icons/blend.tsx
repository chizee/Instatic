import React from 'react';
import type { IconProps } from '../types';

export function BlendIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="6" y="2" width="6" height="2" fill={color}/>
      <rect x="6" y="14" width="6" height="2" fill={color}/>
      <rect x="12" y="4" width="2" height="2" fill={color}/>
      <rect x="4" y="4" width="2" height="2" fill={color}/>
      <rect x="4" y="12" width="2" height="2" fill={color}/>
      <rect x="12" y="12" width="2" height="2" fill={color}/>
      <rect x="14" y="6" width="2" height="6" fill={color}/>
      <rect x="2" y="6" width="2" height="6" fill={color}/>
      <rect x="12" y="8" width="6" height="2" fill={color}/>
      <rect x="12" y="20" width="6" height="2" fill={color}/>
      <rect x="18" y="10" width="2" height="2" fill={color}/>
      <rect x="10" y="10" width="2" height="2" fill={color}/>
      <rect x="10" y="18" width="2" height="2" fill={color}/>
      <rect x="18" y="18" width="2" height="2" fill={color}/>
      <rect x="20" y="12" width="2" height="6" fill={color}/>
      <rect x="8" y="12" width="2" height="6" fill={color}/>
    </svg>
  );
}
