import React from 'react';
import type { IconProps } from '../types';

export function ArrowDownZASharpIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="14" y="3" width="7" height="2" fill={color}/>
      <rect x="14" y="9" width="7" height="2" fill={color}/>
      <rect x="16" y="7" width="2" height="2" fill={color}/>
      <rect x="18" y="5" width="2" height="2" fill={color}/>
      <rect x="6" y="3" width="2" height="18" fill={color}/>
      <rect x="4" y="17" width="6" height="2" fill={color}/>
      <rect x="2" y="15" width="10" height="2" fill={color}/>
      <rect x="14" y="15" width="2" height="6" fill={color}/>
      <rect x="14" y="13" width="7" height="2" fill={color}/>
      <rect x="19" y="15" width="2" height="6" fill={color}/>
      <rect x="16" y="17" width="3" height="2" fill={color}/>
    </svg>
  );
}
