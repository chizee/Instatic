import React from 'react';
import type { IconProps } from '../types';

export function TabletSharpIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="3" y="2" width="18" height="2" fill={color}/>
      <rect x="3" y="20" width="18" height="2" fill={color}/>
      <rect x="3" y="4" width="2" height="16" fill={color}/>
      <rect x="19" y="4" width="2" height="16" fill={color}/>
      <rect x="11" y="16" width="2" height="2" fill={color}/>
    </svg>
  );
}
