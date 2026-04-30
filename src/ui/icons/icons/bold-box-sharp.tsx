import React from 'react';
import type { IconProps } from '../types';

export function BoldBoxSharpIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="7" y="7" width="6" height="2" fill={color}/>
      <rect x="7" y="15" width="8" height="2" fill={color}/>
      <rect x="7" y="11" width="8" height="2" fill={color}/>
      <rect x="15" y="11" width="2" height="6" fill={color}/>
      <rect x="13" y="7" width="2" height="4" fill={color}/>
      <rect x="7" y="7" width="2" height="10" fill={color}/>
      <rect x="4" y="2" width="16" height="2" fill={color}/>
      <rect x="4" y="20" width="16" height="2" fill={color}/>
      <rect x="20" y="2" width="2" height="20" fill={color}/>
      <rect x="2" y="2" width="2" height="20" fill={color}/>
    </svg>
  );
}
