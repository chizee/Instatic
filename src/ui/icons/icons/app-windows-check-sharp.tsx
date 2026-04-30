import React from 'react';
import type { IconProps } from '../types';

export function AppWindowsCheckSharpIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="2" y="3" width="20" height="2" fill={color}/>
      <rect x="2" y="19" width="10" height="2" fill={color}/>
      <rect x="2" y="5" width="2" height="14" fill={color}/>
      <rect x="20" y="5" width="2" height="8" fill={color}/>
      <rect x="4" y="7" width="16" height="2" fill={color}/>
      <rect x="12" y="5" width="2" height="2" fill={color}/>
      <rect x="16" y="5" width="2" height="2" fill={color}/>
      <rect x="16" y="19" width="2" height="2" fill={color}/>
      <rect x="18" y="17" width="2" height="2" fill={color}/>
      <rect x="20" y="15" width="2" height="2" fill={color}/>
      <rect x="14" y="17" width="2" height="2" fill={color}/>
    </svg>
  );
}
