import React from 'react';
import type { IconProps } from '../types';

export function CakeSharpIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="1" y="20" width="22" height="2" fill={color}/>
      <rect x="3" y="12" width="2" height="8" fill={color}/>
      <rect x="3" y="10" width="18" height="2" fill={color}/>
      <rect x="19" y="12" width="2" height="8" fill={color}/>
      <rect x="11" y="7" width="2" height="3" fill={color}/>
      <rect x="7" y="7" width="2" height="3" fill={color}/>
      <rect x="15" y="7" width="2" height="3" fill={color}/>
      <rect x="7" y="3" width="2" height="2" fill={color}/>
      <rect x="11" y="3" width="2" height="2" fill={color}/>
      <rect x="15" y="3" width="2" height="2" fill={color}/>
      <rect x="5" y="14" width="2" height="2" fill={color}/>
      <rect x="7" y="16" width="4" height="2" fill={color}/>
      <rect x="11" y="14" width="6" height="2" fill={color}/>
      <rect x="17" y="16" width="2" height="2" fill={color}/>
    </svg>
  );
}
