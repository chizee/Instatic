import React from 'react';
import type { IconProps } from '../types';

export function BackpackPlusSharpIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="3" y="6" width="18" height="2" fill={color}/>
      <rect x="3" y="8" width="2" height="12" fill={color}/>
      <rect x="3" y="20" width="11" height="2" fill={color}/>
      <rect x="19" y="8" width="2" height="6" fill={color}/>
      <rect x="7" y="16" width="2" height="6" fill={color}/>
      <rect x="7" y="14" width="9" height="2" fill={color}/>
      <rect x="7" y="10" width="10" height="2" fill={color}/>
      <rect x="8" y="4" width="2" height="2" fill={color}/>
      <rect x="14" y="4" width="2" height="2" fill={color}/>
      <rect x="8" y="2" width="8" height="2" fill={color}/>
      <rect x="18" y="16" width="2" height="6" fill={color}/>
      <rect x="16" y="18" width="6" height="2" fill={color}/>
    </svg>
  );
}
