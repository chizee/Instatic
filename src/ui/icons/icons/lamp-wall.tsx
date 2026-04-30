import React from 'react';
import type { IconProps } from '../types';

export function LampWallIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="17" y="5" width="2" height="2" fill={color}/>
      <rect x="19" y="7" width="2" height="2" fill={color}/>
      <rect x="9" y="5" width="2" height="2" fill={color}/>
      <rect x="7" y="7" width="2" height="2" fill={color}/>
      <rect x="11" y="3" width="6" height="2" fill={color}/>
      <rect x="13" y="11" width="2" height="5" fill={color}/>
      <rect x="7" y="9" width="14" height="2" fill={color}/>
      <rect x="9" y="16" width="4" height="2" fill={color}/>
      <rect x="3" y="13" width="4" height="2" fill={color}/>
      <rect x="3" y="19" width="4" height="2" fill={color}/>
      <rect x="7" y="15" width="2" height="4" fill={color}/>
      <rect x="3" y="15" width="2" height="4" fill={color}/>
    </svg>
  );
}
